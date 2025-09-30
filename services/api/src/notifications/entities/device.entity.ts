import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum DevicePlatform {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
}

@Entity('devices')
export class Device {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty()
  @Column({ length: 500 })
  device_token: string;

  @ApiProperty({ enum: DevicePlatform })
  @Column({ type: 'enum', enum: DevicePlatform })
  platform: DevicePlatform;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_seen: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}