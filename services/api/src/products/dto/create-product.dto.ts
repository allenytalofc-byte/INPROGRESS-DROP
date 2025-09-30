import { IsString, IsNumber, IsOptional, IsArray, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Wireless Headphones' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'High-quality wireless headphones with noise cancellation', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 399.99, required: false })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ example: 'SKU-12345', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: '1234567890123', required: false })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ example: ['https://example.com/img1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ example: 'Electronics', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: ['wireless', 'audio', 'premium'], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: 0.5, required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;
}