import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('suppliers')
export class Supplier {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty()
  @Column({ nullable: true })
  company_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  business_license: string;

  @ApiProperty()
  @Column({ nullable: true })
  tax_id: string;

  @ApiProperty()
  @Column({ nullable: true })
  contact_person: string;

  @ApiProperty()
  @Column({ nullable: true })
  website: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.00 })
  commission_rate: number;

  @ApiProperty()
  @Column({ default: false })
  is_verified: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}