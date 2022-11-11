import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar, Match, User, UserStats } from 'db-interface/Core';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStats, Avatar, Match])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
