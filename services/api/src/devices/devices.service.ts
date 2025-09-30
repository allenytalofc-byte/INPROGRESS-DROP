import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DevicesService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async registerDevice(userId: string, deviceToken: string) {
    await this.pool.query(
      `INSERT INTO devices (user_id, device_token) VALUES ($1,$2)
       ON CONFLICT (device_token) DO UPDATE SET user_id=EXCLUDED.user_id`,
      [userId, deviceToken]
    );
    return { success: true };
  }
}