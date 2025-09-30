import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'fcm-token-here' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'web', enum: ['web', 'ios', 'android'], required: false })
  @IsOptional()
  @IsEnum(['web', 'ios', 'android'])
  device_type?: string;

  @ApiProperty({ example: 'Chrome on Windows', required: false })
  @IsOptional()
  @IsString()
  device_name?: string;
}