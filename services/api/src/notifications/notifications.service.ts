import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DevicePlatform } from './entities/device.entity';
import { Notification, TargetAudience } from './entities/notification.entity';
import { FirebaseService } from './firebase.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private firebaseService: FirebaseService,
  ) {}

  async registerDevice(userId: number, registerDeviceDto: RegisterDeviceDto): Promise<Device> {
    // Check if device already exists for this user
    const existingDevice = await this.deviceRepository.findOne({
      where: { user_id: userId, device_token: registerDeviceDto.device_token },
    });

    if (existingDevice) {
      existingDevice.last_seen = new Date();
      existingDevice.is_active = true;
      return this.deviceRepository.save(existingDevice);
    }

    const device = this.deviceRepository.create({
      user_id: userId,
      device_token: registerDeviceDto.device_token,
      platform: registerDeviceDto.platform,
    });

    return this.deviceRepository.save(device);
  }

  async getUserDevices(userId: number): Promise<Device[]> {
    return this.deviceRepository.find({
      where: { user_id: userId, is_active: true },
    });
  }

  async getAllActiveDevices(): Promise<Device[]> {
    return this.deviceRepository.find({
      where: { is_active: true },
    });
  }

  async getDevicesByAudience(audience: TargetAudience): Promise<Device[]> {
    const query = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.user', 'user')
      .where('device.is_active = :active', { active: true });

    switch (audience) {
      case TargetAudience.CUSTOMERS:
        query.andWhere('user.role = :role', { role: 'customer' });
        break;
      case TargetAudience.SUPPLIERS:
        query.andWhere('user.role = :role', { role: 'supplier' });
        break;
      case TargetAudience.ADMINS:
        query.andWhere('user.role = :role', { role: 'admin' });
        break;
      case TargetAudience.ALL:
      default:
        // No additional filter
        break;
    }

    return query.getMany();
  }

  async sendNotification(sendNotificationDto: SendNotificationDto, createdBy: number): Promise<Notification> {
    // Save notification to database
    const notification = this.notificationRepository.create({
      ...sendNotificationDto,
      created_by: createdBy,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Get target devices
    let devices: Device[];
    if (sendNotificationDto.target_users && sendNotificationDto.target_users.length > 0) {
      devices = await this.deviceRepository.find({
        where: { 
          user_id: sendNotificationDto.target_users[0], // Simplified for now
          is_active: true 
        },
      });
    } else {
      devices = await this.getDevicesByAudience(sendNotificationDto.target_audience);
    }

    if (devices.length > 0) {
      const deviceTokens = devices.map(device => device.device_token);
      
      try {
        await this.firebaseService.sendMulticastNotification(
          deviceTokens,
          sendNotificationDto.title,
          sendNotificationDto.message,
          {
            type: sendNotificationDto.type,
            notificationId: savedNotification.id.toString(),
          }
        );

        // Update notification as sent
        savedNotification.sent_at = new Date();
        await this.notificationRepository.save(savedNotification);
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }

    return savedNotification;
  }

  async getNotifications(userId?: number): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.creator', 'creator')
      .orderBy('notification.created_at', 'DESC');

    if (userId) {
      query.where('notification.target_users @> :userId', { userId: [userId] });
    }

    return query.getMany();
  }

  async deactivateDevice(deviceToken: string): Promise<void> {
    const device = await this.deviceRepository.findOne({
      where: { device_token: deviceToken },
    });

    if (device) {
      device.is_active = false;
      await this.deviceRepository.save(device);
    }
  }
}