import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('products')
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_price: number;

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  sku: string;

  @ApiProperty()
  @Column({ nullable: true })
  category: string;

  @ApiProperty()
  @Column({ nullable: true })
  brand: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @ApiProperty()
  @Column({ nullable: true })
  dimensions: string;

  @ApiProperty()
  @Column({ type: 'jsonb', default: '[]' })
  images: string[];

  @ApiProperty()
  @Column({ default: 0 })
  stock_quantity: number;

  @ApiProperty()
  @Column({ default: 0 })
  min_stock_level: number;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  supplier_id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'supplier_id' })
  supplier: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  order_items: OrderItem[];
}