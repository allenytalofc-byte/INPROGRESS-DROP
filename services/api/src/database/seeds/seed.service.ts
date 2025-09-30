import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminUser = await this.createAdminUser();
    console.log('✅ Admin user created');

    // Create supplier user
    const supplierUser = await this.createSupplierUser();
    console.log('✅ Supplier user created');

    // Create categories
    const categories = await this.createCategories();
    console.log('✅ Categories created');

    // Create supplier profile
    const supplier = await this.createSupplierProfile(supplierUser.id);
    console.log('✅ Supplier profile created');

    // Create sample products
    const products = await this.createSampleProducts(supplierUser.id, categories);
    console.log('✅ Sample products created');

    console.log('🎉 Database seeding completed!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@dropshipping.com / admin123');
    console.log('Supplier: supplier@dropshipping.com / supplier123');
  }

  private async createAdminUser(): Promise<User> {
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: 'admin@dropshipping.com' },
    });

    if (existingAdmin) {
      return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = this.usersRepository.create({
      email: 'admin@dropshipping.com',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: UserRole.ADMIN,
      phone: '+1234567890',
      address: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      zip_code: '12345',
      country: 'Admin Country',
      is_active: true,
      email_verified: true,
    });

    return this.usersRepository.save(adminUser);
  }

  private async createSupplierUser(): Promise<User> {
    const existingSupplier = await this.usersRepository.findOne({
      where: { email: 'supplier@dropshipping.com' },
    });

    if (existingSupplier) {
      return existingSupplier;
    }

    const hashedPassword = await bcrypt.hash('supplier123', 10);
    const supplierUser = this.usersRepository.create({
      email: 'supplier@dropshipping.com',
      password_hash: hashedPassword,
      first_name: 'Supplier',
      last_name: 'User',
      role: UserRole.SUPPLIER,
      phone: '+1234567891',
      address: '456 Supplier Avenue',
      city: 'Supplier City',
      state: 'Supplier State',
      zip_code: '54321',
      country: 'Supplier Country',
      is_active: true,
      email_verified: true,
    });

    return this.usersRepository.save(supplierUser);
  }

  private async createCategories(): Promise<Category[]> {
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and gardening' },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear' },
      { name: 'Books', slug: 'books', description: 'Books and educational materials' },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { slug: categoryData.slug },
      });

      if (!existingCategory) {
        const category = this.categoriesRepository.create(categoryData);
        createdCategories.push(await this.categoriesRepository.save(category));
      } else {
        createdCategories.push(existingCategory);
      }
    }

    return createdCategories;
  }

  private async createSupplierProfile(userId: number): Promise<Supplier> {
    const existingSupplier = await this.suppliersRepository.findOne({
      where: { user_id: userId },
    });

    if (existingSupplier) {
      return existingSupplier;
    }

    const supplier = this.suppliersRepository.create({
      user_id: userId,
      company_name: 'Sample Supplier Co.',
      business_license: 'BL123456789',
      tax_id: 'TAX123456789',
      contact_person: 'John Supplier',
      website: 'https://supplier.example.com',
      commission_rate: 15.00,
      is_verified: true,
    });

    return this.suppliersRepository.save(supplier);
  }

  private async createSampleProducts(supplierId: number, categories: Category[]): Promise<Product[]> {
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        cost_price: 60.00,
        sku: 'WBH001',
        category: 'Electronics',
        brand: 'TechBrand',
        weight: 0.3,
        dimensions: '20x15x8 cm',
        images: ['https://via.placeholder.com/300x300?text=Headphones'],
        stock_quantity: 100,
        min_stock_level: 10,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        cost_price: 12.00,
        sku: 'CTS001',
        category: 'Clothing',
        brand: 'FashionBrand',
        weight: 0.2,
        dimensions: 'S, M, L, XL',
        images: ['https://via.placeholder.com/300x300?text=T-Shirt'],
        stock_quantity: 200,
        min_stock_level: 20,
      },
      {
        name: 'Garden Tool Set',
        description: 'Complete set of gardening tools',
        price: 49.99,
        cost_price: 30.00,
        sku: 'GTS001',
        category: 'Home & Garden',
        brand: 'GardenPro',
        weight: 2.5,
        dimensions: '50x30x15 cm',
        images: ['https://via.placeholder.com/300x300?text=Garden+Tools'],
        stock_quantity: 50,
        min_stock_level: 5,
      },
    ];

    const createdProducts = [];
    for (const productData of products) {
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: productData.sku },
      });

      if (!existingProduct) {
        const product = this.productsRepository.create({
          ...productData,
          supplier_id: supplierId,
        });
        createdProducts.push(await this.productsRepository.save(product));
      }
    }

    return createdProducts;
  }
}