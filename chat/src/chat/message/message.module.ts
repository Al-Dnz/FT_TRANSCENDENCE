import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageGateway } from './message.gateway';
import { ChannelService } from 'src/chat/channel/channel.service';

import {
    Channel,
	Message,
	User
} from 'db-interface/Core';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel, User])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
