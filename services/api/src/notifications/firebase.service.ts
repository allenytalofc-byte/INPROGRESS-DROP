import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    try {
      // Check if Firebase credentials are configured
      if (!process.env.FIREBASE_PROJECT_ID || 
          !process.env.FIREBASE_PRIVATE_KEY || 
          !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('⚠️  Firebase credentials not configured. Push notifications will not work.');
        return;
      }

      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error.message);
    }
  }

  async sendToDevice(token: string, payload: { title: string; body: string; data?: any }) {
    if (!this.app) {
      console.warn('Firebase not initialized. Skipping notification.');
      return null;
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        token: token,
      };

      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    payload: { title: string; body: string; data?: any }
  ) {
    if (!this.app || tokens.length === 0) {
      return null;
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      return response;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }
}