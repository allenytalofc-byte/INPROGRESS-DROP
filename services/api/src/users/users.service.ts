import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async create(userData: any) {
    const { email, password, name, role = 'customer', phone } = userData;

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const id = uuidv4();
    const query = `
      INSERT INTO users (id, email, password, name, role, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role, phone, avatar_url, is_active, created_at
    `;

    const result = await this.pool.query(query, [id, email, password, name, role, phone]);
    return result.rows[0];
  }

  async findById(id: string) {
    const query = `
      SELECT id, email, name, role, phone, avatar_url, is_active, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async findByEmail(email: string) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  async update(id: string, updateData: any) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && key !== 'id' && key !== 'password') {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return user;
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, role, phone, avatar_url, is_active, created_at, updated_at
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll(filters: any = {}) {
    let query = `
      SELECT id, email, name, role, phone, avatar_url, is_active, created_at
      FROM users
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, values);
    return result.rows;
  }
}