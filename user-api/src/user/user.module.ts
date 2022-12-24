import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar, BlockerBlocked, User, UserSettings, UserStats } from 'db-interface/Core';
import { UserGateway } from './user.gateway';
import {JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }), TypeOrmModule.forFeature([User, UserStats, Avatar, UserSettings, BlockerBlocked])],
  controllers: [UserController],
  providers: [UserService, UserGateway],
  exports: [UserService]
})
export class UserModule {}
