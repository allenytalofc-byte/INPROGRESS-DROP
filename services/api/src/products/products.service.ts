import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async create(productData: any, vendorId: string) {
    const id = uuidv4();
    const sku = productData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO products (
        id, vendor_id, name, description, price, compare_at_price, cost,
        sku, barcode, stock_quantity, image_url, images, category, tags, weight
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      id,
      vendorId,
      productData.name,
      productData.description || null,
      productData.price,
      productData.compare_at_price || null,
      productData.cost || null,
      sku,
      productData.barcode || null,
      productData.stock_quantity || 0,
      productData.image_url || null,
      productData.images || null,
      productData.category || null,
      productData.tags || null,
      productData.weight || null,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll(filters: any = {}) {
    let query = `
      SELECT p.*, u.name as vendor_name
      FROM products p
      LEFT JOIN users u ON p.vendor_id = u.id
      WHERE p.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND p.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.vendor_id) {
      query += ` AND p.vendor_id = $${paramCount}`;
      values.push(filters.vendor_id);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string) {
    const query = `
      SELECT p.*, u.name as vendor_name, u.email as vendor_email
      FROM products p
      LEFT JOIN users u ON p.vendor_id = u.id
      WHERE p.id = $1
    `;
    const result = await this.pool.query(query, [id]);
    
    if (!result.rows[0]) {
      throw new NotFoundException('Product not found');
    }
    
    return result.rows[0];
  }

  async update(id: string, updateData: any, userId: string, userRole: string) {
    const product = await this.findById(id);

    // Only vendor who owns the product or admin can update
    if (product.vendor_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'name', 'description', 'price', 'compare_at_price', 'cost',
      'sku', 'barcode', 'stock_quantity', 'image_url', 'images',
      'category', 'tags', 'is_active', 'weight'
    ];

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return product;
    }

    values.push(id);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string, userId: string, userRole: string) {
    const product = await this.findById(id);

    if (product.vendor_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this product');
    }

    const query = `DELETE FROM products WHERE id = $1`;
    await this.pool.query(query, [id]);
    
    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: string, quantity: number) {
    const query = `
      UPDATE products
      SET stock_quantity = stock_quantity + $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [quantity, id]);
    return result.rows[0];
  }
}