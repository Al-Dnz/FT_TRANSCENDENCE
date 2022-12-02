import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageGateway } from './message.gateway';

import {Channel,Message,User} from 'db-interface/Core';

import { UserModule } from '../user/user.module'; 

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Message, Channel, User])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})
export class MessageModule {}
