import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum TargetAudience {
  ALL = 'all',
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
  ADMINS = 'admins',
}

@Entity('notifications')
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ enum: NotificationType })
  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
  type: NotificationType;

  @ApiProperty({ enum: TargetAudience })
  @Column({ type: 'enum', enum: TargetAudience, default: TargetAudience.ALL })
  target_audience: TargetAudience;

  @ApiProperty()
  @Column({ type: 'int', array: true, nullable: true })
  target_users: number[];

  @ApiProperty()
  @Column({ nullable: true })
  sent_at: Date;

  @ApiProperty()
  @Column({ nullable: true })
  created_by: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
}