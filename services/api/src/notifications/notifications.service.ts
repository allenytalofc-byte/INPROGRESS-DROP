import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from './firebase.service';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private firebaseService: FirebaseService,
    private devicesService: DevicesService,
  ) {}

  async create(notificationData: any) {
    const id = uuidv4();
    const query = `
      INSERT INTO notifications (id, user_id, title, body, data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      id,
      notificationData.user_id,
      notificationData.title,
      notificationData.body,
      JSON.stringify(notificationData.data || {}),
    ]);

    return result.rows[0];
  }

  async sendToUser(userId: string, payload: { title: string; body: string; data?: any }) {
    // Save notification to database
    await this.create({
      user_id: userId,
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });

    // Get user's device tokens
    const tokens = await this.devicesService.findActiveTokens([userId]);

    if (tokens.length === 0) {
      return { success: true, message: 'Notification saved but no active devices found' };
    }

    // Send push notification
    try {
      const response = await this.firebaseService.sendToMultipleDevices(tokens, payload);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendToMultipleUsers(
    userIds: string[],
    payload: { title: string; body: string; data?: any }
  ) {
    // Save notifications for all users
    const promises = userIds.map(userId =>
      this.create({
        user_id: userId,
        title: payload.title,
        body: payload.body,
        data: payload.data,
      })
    );

    await Promise.all(promises);

    // Get all device tokens
    const tokens = await this.devicesService.findActiveTokens(userIds);

    if (tokens.length === 0) {
      return { success: true, message: 'Notifications saved but no active devices found' };
    }

    // Send push notifications
    try {
      const response = await this.firebaseService.sendToMultipleDevices(tokens, payload);
      return { success: true, response, recipients: userIds.length };
    } catch (error) {
      console.error('Error sending push notifications:', error);
      return { success: false, error: error.message };
    }
  }

  async findByUserId(userId: string) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY sent_at DESC
      LIMIT 50
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async markAsRead(id: string, userId: string) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, userId]);
    return result.rows[0];
  }

  async markAllAsRead(userId: string) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `;
    const result = await this.pool.query(query, [userId]);
    return { updated: result.rowCount };
  }
}