import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar, User, UserSettings, UserStats } from 'db-interface/Core';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStats, Avatar, UserSettings])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
