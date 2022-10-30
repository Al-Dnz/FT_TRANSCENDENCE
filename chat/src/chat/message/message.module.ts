import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity'
import { MessageGateway } from './message.gateway';
import { ChannelService } from 'src/chat/channel/channel.service';
import { Channel } from 'src/chat/channel/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
