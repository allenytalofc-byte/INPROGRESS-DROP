const { Pool } = require('pg');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

// Database connection
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'dropshipping_db',
  user: process.env.DATABASE_USER || 'dropshipping_user',
  password: process.env.DATABASE_PASSWORD || 'dropshipping_password',
});

class WorkerService {
  constructor() {
    this.pool = pool;
    this.isRunning = false;
  }

  async start() {
    console.log('🚀 Starting Dropshipping Workers...');
    this.isRunning = true;

    // Schedule tasks
    this.scheduleTasks();

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('🛑 Shutting down workers...');
      this.stop();
    });

    process.on('SIGTERM', () => {
      console.log('🛑 Shutting down workers...');
      this.stop();
    });
  }

  scheduleTasks() {
    // Sync product stock every hour
    cron.schedule('0 * * * *', async () => {
      console.log('📦 Running hourly stock sync...');
      await this.syncProductStock();
    });

    // Clean up old notifications daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('🧹 Cleaning up old notifications...');
      await this.cleanupOldNotifications();
    });

    // Update low stock alerts every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      console.log('⚠️ Checking low stock levels...');
      await this.checkLowStockLevels();
    });

    // Process pending orders every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      console.log('📋 Processing pending orders...');
      await this.processPendingOrders();
    });

    console.log('⏰ Scheduled tasks configured');
  }

  async syncProductStock() {
    const client = await this.pool.connect();
    
    try {
      // Get all active suppliers
      const suppliers = await client.query(`
        SELECT s.*, u.email 
        FROM suppliers s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.is_verified = true AND u.is_active = true
      `);

      for (const supplier of suppliers.rows) {
        try {
          // This would integrate with supplier APIs
          // For now, we'll just log the sync attempt
          console.log(`Syncing stock for supplier: ${supplier.company_name || supplier.email}`);
          
          // Example: Update stock based on some logic
          // await this.updateSupplierStock(supplier.id);
        } catch (error) {
          console.error(`Error syncing stock for supplier ${supplier.id}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error in stock sync:', error);
    } finally {
      client.release();
    }
  }

  async cleanupOldNotifications() {
    const client = await this.pool.connect();
    
    try {
      // Delete notifications older than 30 days
      const result = await client.query(`
        DELETE FROM notifications 
        WHERE created_at < NOW() - INTERVAL '30 days'
      `);
      
      console.log(`Cleaned up ${result.rowCount} old notifications`);
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    } finally {
      client.release();
    }
  }

  async checkLowStockLevels() {
    const client = await this.pool.connect();
    
    try {
      // Find products with low stock
      const lowStockProducts = await client.query(`
        SELECT p.*, u.email as supplier_email
        FROM products p
        JOIN users u ON p.supplier_id = u.id
        WHERE p.stock_quantity <= p.min_stock_level 
        AND p.is_active = true
        AND p.supplier_id IS NOT NULL
      `);

      for (const product of lowStockProducts.rows) {
        // Send notification to supplier
        await this.sendLowStockNotification(product);
      }
    } catch (error) {
      console.error('Error checking low stock levels:', error);
    } finally {
      client.release();
    }
  }

  async sendLowStockNotification(product) {
    try {
      const client = await this.pool.connect();
      
      try {
        // Create notification for supplier
        await client.query(`
          INSERT INTO notifications (
            title, message, type, target_audience, target_users, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          'Low Stock Alert',
          `Product "${product.name}" is running low on stock. Current stock: ${product.stock_quantity}`,
          'warning',
          'suppliers',
          [product.supplier_id],
          1 // System user
        ]);

        console.log(`Low stock notification sent for product: ${product.name}`);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error sending low stock notification:', error);
    }
  }

  async processPendingOrders() {
    const client = await this.pool.connect();
    
    try {
      // Find orders that need processing
      const pendingOrders = await client.query(`
        SELECT o.*, u.email as customer_email
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.status = 'pending'
        AND o.created_at < NOW() - INTERVAL '1 hour'
        ORDER BY o.created_at ASC
        LIMIT 10
      `);

      for (const order of pendingOrders.rows) {
        try {
          // Process the order (update status, send notifications, etc.)
          await this.processOrder(order);
        } catch (error) {
          console.error(`Error processing order ${order.id}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error processing pending orders:', error);
    } finally {
      client.release();
    }
  }

  async processOrder(order) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update order status to confirmed
      await client.query(`
        UPDATE orders 
        SET status = 'confirmed', updated_at = NOW() 
        WHERE id = $1
      `, [order.id]);

      // Send notification to customer
      await client.query(`
        INSERT INTO notifications (
          title, message, type, target_audience, target_users, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'Order Confirmed',
        `Your order #${order.order_number} has been confirmed and is being processed.`,
        'success',
        'customers',
        [order.customer_id],
        1 // System user
      ]);

      await client.query('COMMIT');
      console.log(`Processed order: ${order.order_number}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async stop() {
    this.isRunning = false;
    await this.pool.end();
    console.log('✅ Workers stopped');
    process.exit(0);
  }
}

// Start the worker service
const workerService = new WorkerService();
workerService.start().catch((error) => {
  console.error('Failed to start workers:', error);
  process.exit(1);
});