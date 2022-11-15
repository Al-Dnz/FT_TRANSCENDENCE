import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

import { TypeOrmModule } from '@nestjs/typeorm'; 

import { ChannelGateway } from './channel.gateway';


import {
    Channel,
	Message
} from 'db-interface/Core';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message])],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway]
})
export class ChannelModule {}
