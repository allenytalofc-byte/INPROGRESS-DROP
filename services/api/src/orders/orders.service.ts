import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrdersService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async listByUser(userId: string) {
    const res = await this.pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  async listAll() {
    const res = await this.pool.query(
      `SELECT o.*, u.email AS user_email FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    return res.rows;
  }

  async get(id: string) {
    const res = await this.pool.query('SELECT * FROM orders WHERE id=$1', [id]);
    const order = res.rows[0] || null;
    if (!order) return null;
    const itemsRes = await this.pool.query('SELECT * FROM order_items WHERE order_id=$1', [id]);
    return { ...order, items: itemsRes.rows };
  }

  async create(userId: string, items: Array<{ product_id: string; quantity: number; price_cents: number }>, currency = 'USD') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const total = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
      const orderRes = await client.query(
        `INSERT INTO orders (user_id, total_cents, currency, status) VALUES ($1,$2,$3,'pending') RETURNING *`,
        [userId, total, currency]
      );
      const order = orderRes.rows[0];
      for (const it of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES ($1,$2,$3,$4)`,
          [order.id, it.product_id, it.quantity, it.price_cents]
        );
      }
      await client.query('COMMIT');
      return this.get(order.id);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}