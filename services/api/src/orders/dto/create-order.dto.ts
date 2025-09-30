import { IsArray, IsString, IsNumber, IsOptional, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  shipping_name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  shipping_email: string;

  @ApiProperty({ example: '+55 11 99999-9999' })
  @IsString()
  shipping_phone: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  shipping_address_line1: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsOptional()
  @IsString()
  shipping_address_line2?: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  shipping_city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  shipping_state: string;

  @ApiProperty({ example: '01234-567' })
  @IsString()
  shipping_zip: string;

  @ApiProperty({ example: 'Brazil', required: false })
  @IsOptional()
  @IsString()
  shipping_country?: string;

  @ApiProperty({ example: 15.00, required: false })
  @IsOptional()
  @IsNumber()
  shipping_cost?: number;

  @ApiProperty({ example: 10.00, required: false })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({ example: 'card', required: false })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ example: 'BRL', required: false })
  @IsOptional()
  @IsString()
  currency?: string;
}