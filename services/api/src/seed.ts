import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://dropship_user:dropship_password@localhost:5432/dropship_db',
  });

  try {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    await pool.query(
      `INSERT INTO users (id, email, password, name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [adminId, 'admin@dropship.com', adminPassword, 'System Administrator', 'admin']
    );

    console.log('✅ Admin user created');
    console.log('   Email: admin@dropship.com');
    console.log('   Password: Admin@123');

    // Create vendor user
    const vendorId = uuidv4();
    const vendorPassword = await bcrypt.hash('Vendor@123', 10);

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      [vendorId, 'vendor@dropship.com', vendorPassword, 'Tech Vendor', 'vendor', '+55 11 98765-4321']
    );

    // Create vendor profile
    await pool.query(
      `INSERT INTO vendor_profiles (id, user_id, business_name, business_description, commission_rate, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO NOTHING`,
      [
        uuidv4(),
        vendorId,
        'Tech Solutions Ltd',
        'Premium electronics and gadgets supplier',
        12.5,
        true
      ]
    );

    console.log('✅ Vendor user created');
    console.log('   Email: vendor@dropship.com');
    console.log('   Password: Vendor@123');

    // Create customer user
    const customerId = uuidv4();
    const customerPassword = await bcrypt.hash('Customer@123', 10);

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      [customerId, 'customer@dropship.com', customerPassword, 'John Customer', 'customer', '+55 11 91234-5678']
    );

    console.log('✅ Customer user created');
    console.log('   Email: customer@dropship.com');
    console.log('   Password: Customer@123');

    // Create sample products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 299.99,
        compare_at_price: 399.99,
        cost: 150.00,
        stock_quantity: 50,
        category: 'Electronics',
        tags: ['audio', 'wireless', 'premium'],
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor',
        price: 449.99,
        compare_at_price: 599.99,
        cost: 200.00,
        stock_quantity: 30,
        category: 'Electronics',
        tags: ['smartwatch', 'fitness', 'health'],
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      },
      {
        name: 'USB-C Fast Charger',
        description: '65W fast charging adapter with universal compatibility',
        price: 49.99,
        compare_at_price: 79.99,
        cost: 20.00,
        stock_quantity: 100,
        category: 'Accessories',
        tags: ['charger', 'usb-c', 'fast-charging'],
        image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      },
      {
        name: 'Portable Power Bank 20000mAh',
        description: 'High-capacity power bank with dual USB ports and LED display',
        price: 89.99,
        compare_at_price: 119.99,
        cost: 35.00,
        stock_quantity: 75,
        category: 'Accessories',
        tags: ['power-bank', 'portable', 'charging'],
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with customizable keys',
        price: 179.99,
        compare_at_price: 249.99,
        cost: 80.00,
        stock_quantity: 40,
        category: 'Gaming',
        tags: ['gaming', 'keyboard', 'rgb'],
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      },
    ];

    for (const product of products) {
      const productId = uuidv4();
      const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      await pool.query(
        `INSERT INTO products (
          id, vendor_id, name, description, price, compare_at_price, cost,
          sku, stock_quantity, category, tags, image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          productId,
          vendorId,
          product.name,
          product.description,
          product.price,
          product.compare_at_price,
          product.cost,
          sku,
          product.stock_quantity,
          product.category,
          product.tags,
          product.image_url,
        ]
      );
    }

    console.log(`✅ ${products.length} sample products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('   Admin:    admin@dropship.com / Admin@123');
    console.log('   Vendor:   vendor@dropship.com / Vendor@123');
    console.log('   Customer: customer@dropship.com / Customer@123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();