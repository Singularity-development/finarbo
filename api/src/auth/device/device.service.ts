import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceType } from './device.entity';
import { RefreshToken } from '../token/token.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async saveUserDevice(refreshToken: RefreshToken, req: Request) {
    const device = new Device();
    device.ipAddress = req.ip;
    device.refreshToken = refreshToken;

    const userAgent = req.get('User-Agent');

    if (userAgent) {
      device.userAgent = req.get('User-Agent');
      device.deviceType = this.getDeviceType(userAgent);
    } else {
      device.deviceType = DeviceType.OTHER;
    }

    return await this.deviceRepository.save(device);
  }

  private getDeviceType(userAgent: string): DeviceType {
    if (/mobile/i.test(userAgent)) {
      return DeviceType.MOBILE;
    } else if (/tablet/i.test(userAgent)) {
      return DeviceType.MOBILE;
    } else {
      return DeviceType.WEB;
    }
  }
}
