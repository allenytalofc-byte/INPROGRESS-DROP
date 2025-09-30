import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendNotificationDto } from './dto/send-notification.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  async findAll(@CurrentUser() user: any) {
    return this.notificationsService.findByUserId(user.id);
  }

  @Post('send')
  @UseGuards(RolesGuard)
  @Roles('admin', 'vendor')
  @ApiOperation({ summary: 'Send notification to specific user (Admin/Vendor only)' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  async send(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.sendToUser(
      sendNotificationDto.user_id,
      {
        title: sendNotificationDto.title,
        body: sendNotificationDto.body,
        data: sendNotificationDto.data,
      }
    );
  }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Broadcast notification to multiple users (Admin only)' })
  @ApiResponse({ status: 201, description: 'Notifications sent successfully' })
  async broadcast(@Body() broadcastNotificationDto: BroadcastNotificationDto) {
    return this.notificationsService.sendToMultipleUsers(
      broadcastNotificationDto.user_ids,
      {
        title: broadcastNotificationDto.title,
        body: broadcastNotificationDto.body,
        data: broadcastNotificationDto.data,
      }
    );
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}