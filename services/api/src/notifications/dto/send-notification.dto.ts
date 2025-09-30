import { IsString, IsEnum, IsOptional, IsArray, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, TargetAudience } from '../entities/notification.entity';

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationType, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ enum: TargetAudience })
  @IsEnum(TargetAudience)
  target_audience: TargetAudience;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  target_users?: number[];
}