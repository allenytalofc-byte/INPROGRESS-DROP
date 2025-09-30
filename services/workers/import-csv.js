const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dropship_user:dropship_password@localhost:5432/dropship_db',
});

async function importProducts(csvFilePath, vendorId) {
  const products = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        products.push(row);
      })
      .on('end', async () => {
        console.log(`📦 Found ${products.length} products to import`);
        
        let imported = 0;
        let errors = 0;

        for (const product of products) {
          try {
            const query = `
              INSERT INTO products (
                id, vendor_id, name, description, price, compare_at_price, cost,
                sku, barcode, stock_quantity, category, tags, image_url
              )
              VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
              )
              ON CONFLICT (sku) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                price = EXCLUDED.price,
                compare_at_price = EXCLUDED.compare_at_price,
                cost = EXCLUDED.cost,
                stock_quantity = EXCLUDED.stock_quantity,
                category = EXCLUDED.category,
                tags = EXCLUDED.tags,
                image_url = EXCLUDED.image_url,
                updated_at = CURRENT_TIMESTAMP
            `;

            const values = [
              vendorId,
              product.name || 'Unnamed Product',
              product.description || '',
              parseFloat(product.price) || 0,
              product.compare_at_price ? parseFloat(product.compare_at_price) : null,
              product.cost ? parseFloat(product.cost) : null,
              product.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              product.barcode || null,
              parseInt(product.stock_quantity) || 0,
              product.category || 'Uncategorized',
              product.tags ? product.tags.split(',').map(t => t.trim()) : null,
              product.image_url || null,
            ];

            await pool.query(query, values);
            imported++;
            console.log(`✅ Imported: ${product.name || product.sku}`);
          } catch (error) {
            errors++;
            console.error(`❌ Error importing ${product.name || product.sku}:`, error.message);
          }
        }

        console.log(`\n📊 Import Summary:`);
        console.log(`   Total: ${products.length}`);
        console.log(`   Imported: ${imported}`);
        console.log(`   Errors: ${errors}`);

        await pool.end();
        resolve({ total: products.length, imported, errors });
      })
      .on('error', reject);
  });
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node import-csv.js <csv_file_path> <vendor_id>');
    console.log('Example: node import-csv.js products.csv 123e4567-e89b-12d3-a456-426614174000');
    process.exit(1);
  }

  const [csvFilePath, vendorId] = args;

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ File not found: ${csvFilePath}`);
    process.exit(1);
  }

  console.log('🚀 Starting product import...');
  console.log(`   File: ${csvFilePath}`);
  console.log(`   Vendor ID: ${vendorId}\n`);

  importProducts(csvFilePath, vendorId)
    .then(() => {
      console.log('\n✅ Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importProducts };