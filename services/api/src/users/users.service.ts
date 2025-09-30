import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findByEmail(email: string) {
    const res = await this.pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return res.rows[0] || null;
  }

  async findById(id: string) {
    const res = await this.pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0] || null;
  }

  async create(data: { email: string; passwordHash: string; name: string | null; role: 'admin' | 'vendor' | 'customer' }) {
    const res = await this.pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, email, name, role, created_at`,
      [data.email, data.passwordHash, data.name, data.role]
    );
    return res.rows[0];
  }
}