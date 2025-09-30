import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'customer', enum: ['customer', 'vendor', 'admin'], required: false })
  @IsOptional()
  @IsEnum(['customer', 'vendor', 'admin'])
  role?: string;

  @ApiProperty({ example: '+55 11 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}