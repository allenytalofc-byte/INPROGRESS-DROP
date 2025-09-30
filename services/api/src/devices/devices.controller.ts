import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RegisterDeviceDto } from './dto/register-device.dto';

@ApiTags('devices')
@Controller('devices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register device token for push notifications' })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  async register(@Body() registerDeviceDto: RegisterDeviceDto, @CurrentUser() user: any) {
    return this.devicesService.register(registerDeviceDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices for current user' })
  @ApiResponse({ status: 200, description: 'Returns user devices' })
  async findAll(@CurrentUser() user: any) {
    return this.devicesService.findByUserId(user.id);
  }

  @Delete(':token')
  @ApiOperation({ summary: 'Deactivate device token' })
  @ApiResponse({ status: 200, description: 'Device deactivated successfully' })
  async deactivate(@Param('token') token: string) {
    return this.devicesService.deactivate(token);
  }
}