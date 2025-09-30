import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BroadcastNotificationDto {
  @ApiProperty({ example: ['user-id-1', 'user-id-2'] })
  @IsArray()
  user_ids: string[];

  @ApiProperty({ example: 'System Update' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'New features available now!' })
  @IsString()
  body: string;

  @ApiProperty({ example: { type: 'system_update' }, required: false })
  @IsOptional()
  @IsObject()
  data?: any;
}