const { Pool } = require('pg');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'dropshipping_db',
  user: process.env.DATABASE_USER || 'dropshipping_user',
  password: process.env.DATABASE_PASSWORD || 'dropshipping_password',
});

class CSVImporter {
  constructor() {
    this.pool = pool;
  }

  async importProductsFromCSV(filePath, supplierId) {
    console.log(`Starting CSV import from ${filePath} for supplier ${supplierId}`);
    
    const products = [];
    const errors = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Validate required fields
            if (!row.name || !row.price) {
              errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
              return;
            }

            const product = {
              name: row.name.trim(),
              description: row.description ? row.description.trim() : null,
              price: parseFloat(row.price),
              cost_price: row.cost_price ? parseFloat(row.cost_price) : null,
              sku: row.sku ? row.sku.trim() : null,
              category: row.category ? row.category.trim() : null,
              brand: row.brand ? row.brand.trim() : null,
              weight: row.weight ? parseFloat(row.weight) : null,
              dimensions: row.dimensions ? row.dimensions.trim() : null,
              images: row.images ? row.images.split(',').map(img => img.trim()) : [],
              stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : 0,
              min_stock_level: row.min_stock_level ? parseInt(row.min_stock_level) : 0,
              is_active: row.is_active !== 'false' && row.is_active !== '0',
              supplier_id: supplierId,
            };

            products.push(product);
          } catch (error) {
            errors.push(`Error processing row: ${error.message} - ${JSON.stringify(row)}`);
          }
        })
        .on('end', async () => {
          console.log(`Parsed ${products.length} products from CSV`);
          
          if (errors.length > 0) {
            console.warn(`Found ${errors.length} errors during parsing:`, errors);
          }

          try {
            const insertedProducts = await this.insertProducts(products);
            console.log(`Successfully imported ${insertedProducts.length} products`);
            resolve({
              success: true,
              imported: insertedProducts.length,
              errors: errors,
              products: insertedProducts
            });
          } catch (error) {
            console.error('Error inserting products:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  }

  async insertProducts(products) {
    const client = await this.pool.connect();
    const insertedProducts = [];

    try {
      await client.query('BEGIN');

      for (const product of products) {
        try {
          const query = `
            INSERT INTO products (
              name, description, price, cost_price, sku, category, brand,
              weight, dimensions, images, stock_quantity, min_stock_level,
              is_active, supplier_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
            RETURNING *
          `;

          const values = [
            product.name,
            product.description,
            product.price,
            product.cost_price,
            product.sku,
            product.category,
            product.brand,
            product.weight,
            product.dimensions,
            JSON.stringify(product.images),
            product.stock_quantity,
            product.min_stock_level,
            product.is_active,
            product.supplier_id,
          ];

          const result = await client.query(query, values);
          insertedProducts.push(result.rows[0]);
        } catch (error) {
          console.error(`Error inserting product ${product.name}:`, error.message);
          // Continue with other products
        }
      }

      await client.query('COMMIT');
      return insertedProducts;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateProductStock(sku, newStock) {
    const client = await this.pool.connect();
    
    try {
      const query = 'UPDATE products SET stock_quantity = $1, updated_at = NOW() WHERE sku = $2 RETURNING *';
      const result = await client.query(query, [newStock, sku]);
      
      if (result.rows.length === 0) {
        throw new Error(`Product with SKU ${sku} not found`);
      }
      
      console.log(`Updated stock for product ${sku} to ${newStock}`);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async syncWithSupplierAPI(supplierId, apiEndpoint, apiKey) {
    console.log(`Syncing products with supplier API for supplier ${supplierId}`);
    
    try {
      const axios = require('axios');
      const response = await axios.get(apiEndpoint, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const apiProducts = response.data.products || response.data;
      const client = await this.pool.connect();

      try {
        await client.query('BEGIN');

        for (const apiProduct of apiProducts) {
          // Check if product exists by SKU
          const existingProduct = await client.query(
            'SELECT id FROM products WHERE sku = $1 AND supplier_id = $2',
            [apiProduct.sku, supplierId]
          );

          if (existingProduct.rows.length > 0) {
            // Update existing product
            await client.query(`
              UPDATE products SET 
                name = $1, description = $2, price = $3, cost_price = $4,
                stock_quantity = $5, is_active = $6, updated_at = NOW()
              WHERE sku = $7 AND supplier_id = $8
            `, [
              apiProduct.name,
              apiProduct.description,
              apiProduct.price,
              apiProduct.cost_price,
              apiProduct.stock_quantity,
              apiProduct.is_active !== false,
              apiProduct.sku,
              supplierId
            ]);
          } else {
            // Insert new product
            await client.query(`
              INSERT INTO products (
                name, description, price, cost_price, sku, category, brand,
                stock_quantity, is_active, supplier_id, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            `, [
              apiProduct.name,
              apiProduct.description,
              apiProduct.price,
              apiProduct.cost_price,
              apiProduct.sku,
              apiProduct.category,
              apiProduct.brand,
              apiProduct.stock_quantity,
              apiProduct.is_active !== false,
              supplierId
            ]);
          }
        }

        await client.query('COMMIT');
        console.log(`Successfully synced ${apiProducts.length} products with supplier API`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error syncing with supplier API:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node import-csv.js <csv-file-path> <supplier-id>');
    console.log('Example: node import-csv.js ./products.csv 1');
    process.exit(1);
  }

  const csvFilePath = args[0];
  const supplierId = parseInt(args[1]);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  const importer = new CSVImporter();
  
  importer.importProductsFromCSV(csvFilePath, supplierId)
    .then((result) => {
      console.log('Import completed:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    })
    .finally(() => {
      importer.close();
    });
}

module.exports = CSVImporter;