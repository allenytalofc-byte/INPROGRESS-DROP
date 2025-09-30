import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  order_id: number;

  @ApiProperty()
  @Column()
  product_id: number;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Order, order => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}