import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Channel } from './channel.entity';
import { ChannelGateway } from './channel.gateway';
import { Message } from '../message/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message])],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway]
})
export class ChannelModule {}
