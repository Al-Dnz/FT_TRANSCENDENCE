import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

import { TypeOrmModule } from '@nestjs/typeorm'; 

import { ChannelGateway } from './channel.gateway';

import { UserModule } from '../user/user.module'; 


import {Channel, Message, User } from 'db-interface/Core';

@Module({
  imports: [ UserModule, TypeOrmModule.forFeature([Channel, Message, User])],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway]
})
export class ChannelModule {}
