import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: 'processing', 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] 
  })
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
  status: string;
}