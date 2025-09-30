import { IsString, IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'New Promotion!' })
  @IsString()
  title: string;

  @ApiProperty({ example: '50% off on selected items' })
  @IsString()
  body: string;

  @ApiProperty({ example: { action: 'view_products', category: 'electronics' }, required: false })
  @IsOptional()
  @IsObject()
  data?: any;
}