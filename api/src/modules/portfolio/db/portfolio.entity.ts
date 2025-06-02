import { User } from 'src/auth/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetEntity } from './asset.entity';

@Entity('portfolios')
export class PortfolioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'portfolio_users',
    joinColumn: {
      name: 'portfolio_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy: User;

  @Column({ nullable: true, length: 32 })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => AssetEntity, (asset) => asset.portfolio)
  assets: AssetEntity[];
}
