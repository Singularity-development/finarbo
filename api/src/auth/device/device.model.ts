import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from '../token/token.model';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => RefreshToken, { onDelete: 'CASCADE' })
  refreshToken: RefreshToken;

  @Column({ nullable: true })
  deviceType: DeviceType;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
}

export enum DeviceType {
  WEB = 'web',
  MOBILE = 'mobile',
  OTHER = 'other',
}
