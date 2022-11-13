import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity'
import { MessageGateway } from './message.gateway';
import { ChannelService } from 'src/chat/channel/channel.service';
import { Channel } from 'src/chat/channel/channel.entity';

import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel, User])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
