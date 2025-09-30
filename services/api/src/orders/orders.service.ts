import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private productsService: ProductsService,
  ) {}

  async create(orderData: any, customerId: string) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const orderId = uuidv4();
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Calculate totals
      let subtotal = 0;
      const items = [];

      for (const item of orderData.items) {
        const product = await this.productsService.findById(item.product_id);
        
        if (!product) {
          throw new BadRequestException(`Product ${item.product_id} not found`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        items.push({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          quantity: item.quantity,
          unit_price: product.price,
          total_price: itemTotal,
        });

        // Update stock
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, product.id]
        );
      }

      const shippingCost = orderData.shipping_cost || 0;
      const tax = orderData.tax || 0;
      const total = subtotal + shippingCost + tax;

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          id, customer_id, order_number, status, subtotal, shipping_cost, tax, total,
          currency, shipping_name, shipping_email, shipping_phone,
          shipping_address_line1, shipping_address_line2, shipping_city,
          shipping_state, shipping_zip, shipping_country, payment_method, payment_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;

      const orderValues = [
        orderId,
        customerId,
        orderNumber,
        'pending',
        subtotal,
        shippingCost,
        tax,
        total,
        orderData.currency || 'BRL',
        orderData.shipping_name,
        orderData.shipping_email,
        orderData.shipping_phone,
        orderData.shipping_address_line1,
        orderData.shipping_address_line2 || null,
        orderData.shipping_city,
        orderData.shipping_state,
        orderData.shipping_zip,
        orderData.shipping_country || 'Brazil',
        orderData.payment_method || 'card',
        'pending',
      ];

      const orderResult = await client.query(orderQuery, orderValues);

      // Create order items
      for (const item of items) {
        const itemId = uuidv4();
        const itemQuery = `
          INSERT INTO order_items (
            id, order_id, product_id, product_name, product_sku,
            quantity, unit_price, total_price
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        await client.query(itemQuery, [
          itemId,
          orderId,
          item.product_id,
          item.product_name,
          item.product_sku,
          item.quantity,
          item.unit_price,
          item.total_price,
        ]);
      }

      await client.query('COMMIT');

      return this.findById(orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(filters: any = {}) {
    let query = `
      SELECT o.*, 
             u.name as customer_name, 
             u.email as customer_email,
             COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.customer_id) {
      query += ` AND o.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND o.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ` GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC`;

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string) {
    const orderQuery = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.id
      WHERE o.id = $1
    `;
    const orderResult = await this.pool.query(orderQuery, [id]);

    if (!orderResult.rows[0]) {
      throw new NotFoundException('Order not found');
    }

    const itemsQuery = `
      SELECT * FROM order_items WHERE order_id = $1
    `;
    const itemsResult = await this.pool.query(itemsQuery, [id]);

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows,
    };
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const query = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.pool.query(query, [status, id]);

    if (!result.rows[0]) {
      throw new NotFoundException('Order not found');
    }

    return this.findById(id);
  }
}