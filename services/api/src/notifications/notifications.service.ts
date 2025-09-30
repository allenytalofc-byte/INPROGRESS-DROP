import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private initialized = false;

  constructor(@Inject('PG_POOL') private readonly pool: Pool) {
    this.ensureInit();
  }

  private ensureInit() {
    if (this.initialized) return;
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
      privateKey = privateKey.replace(/\\n/g, '\n');
      if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        });
      }
    }
    this.initialized = true;
  }

  async sendToAllUsers(title: string, body: string) {
    const res = await this.pool.query('SELECT device_token FROM devices');
    const tokens = res.rows.map((r) => r.device_token).filter(Boolean);
    if (!tokens.length) return { success: true, sent: 0 };
    const message = { notification: { title, body }, tokens } as any;
    const resp = await (admin.messaging().sendEachForMulticast as any)(message);
    return { success: true, sent: resp.successCount, failed: resp.failureCount };
  }
}