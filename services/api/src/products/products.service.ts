import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductsService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async list() {
    const res = await this.pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return res.rows;
  }

  async get(id: string) {
    const res = await this.pool.query('SELECT * FROM products WHERE id=$1', [id]);
    return res.rows[0] || null;
  }

  async create(data: { title: string; description?: string; price_cents: number; currency?: string; image_url?: string; stock?: number; vendor_id?: string | null }) {
    const res = await this.pool.query(
      `INSERT INTO products (title, description, price_cents, currency, image_url, stock, vendor_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.price_cents,
        data.currency || 'USD',
        data.image_url || null,
        data.stock ?? 0,
        data.vendor_id || null,
      ]
    );
    return res.rows[0];
  }

  async update(id: string, data: Partial<{ title: string; description: string; price_cents: number; currency: string; image_url: string; stock: number }>) {
    const current = await this.get(id);
    if (!current) return null;
    const updated = {
      title: data.title ?? current.title,
      description: data.description ?? current.description,
      price_cents: data.price_cents ?? current.price_cents,
      currency: data.currency ?? current.currency,
      image_url: data.image_url ?? current.image_url,
      stock: data.stock ?? current.stock,
    };
    const res = await this.pool.query(
      `UPDATE products SET title=$1, description=$2, price_cents=$3, currency=$4, image_url=$5, stock=$6, updated_at=now() WHERE id=$7 RETURNING *`,
      [updated.title, updated.description, updated.price_cents, updated.currency, updated.image_url, updated.stock, id]
    );
    return res.rows[0];
  }

  async remove(id: string) {
    await this.pool.query('DELETE FROM products WHERE id=$1', [id]);
    return { success: true };
  }
}