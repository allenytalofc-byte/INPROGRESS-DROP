import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DevicesService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async register(deviceData: any, userId: string) {
    // Check if token already exists
    const existingDevice = await this.pool.query(
      'SELECT * FROM devices WHERE token = $1',
      [deviceData.token]
    );

    if (existingDevice.rows[0]) {
      // Update existing device
      const query = `
        UPDATE devices
        SET user_id = $1, device_type = $2, device_name = $3, is_active = true, updated_at = CURRENT_TIMESTAMP
        WHERE token = $4
        RETURNING *
      `;
      const result = await this.pool.query(query, [
        userId,
        deviceData.device_type || 'web',
        deviceData.device_name || 'Unknown Device',
        deviceData.token,
      ]);
      return result.rows[0];
    }

    // Create new device
    const id = uuidv4();
    const query = `
      INSERT INTO devices (id, user_id, token, device_type, device_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      id,
      userId,
      deviceData.token,
      deviceData.device_type || 'web',
      deviceData.device_name || 'Unknown Device',
    ]);

    return result.rows[0];
  }

  async findByUserId(userId: string) {
    const query = `
      SELECT * FROM devices
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async findActiveTokens(userIds: string[]) {
    if (userIds.length === 0) {
      return [];
    }

    const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `
      SELECT DISTINCT token FROM devices
      WHERE user_id IN (${placeholders}) AND is_active = true
    `;
    const result = await this.pool.query(query, userIds);
    return result.rows.map(row => row.token);
  }

  async deactivate(token: string) {
    const query = `
      UPDATE devices
      SET is_active = false
      WHERE token = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, [token]);
    return result.rows[0];
  }
}