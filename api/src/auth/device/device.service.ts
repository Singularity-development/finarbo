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
    const user = refreshToken.user;

    const device = new Device();
    device.ipAddress = req.ip;
    device.user = user;

    const userAgent = req.get('User-Agent');

    if (userAgent) {
      const deviceFound = await this.getDeviceByAgent(user.id, userAgent);

      if (deviceFound) {
        return;
      }

      device.userAgent = userAgent;
      device.deviceType = this.getDeviceType(userAgent);
    } else {
      device.deviceType = DeviceType.OTHER;
    }

    return await this.deviceRepository.save(device);
  }

  private async getDeviceByAgent(userId: string, userAgent: string) {
    return await this.deviceRepository.findOne({
      where: { userAgent, user: { id: userId } },
    });
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
