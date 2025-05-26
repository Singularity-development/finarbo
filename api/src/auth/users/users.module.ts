import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ContextModule } from '@common/middleware/context.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ContextModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
