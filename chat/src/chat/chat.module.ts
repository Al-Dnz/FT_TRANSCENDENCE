import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { UserChannelModule } from './user-channel/user-channel.module';
import { UserModule } from './user/user.module';

import { ChatGateway } from './chat.gateway';

import {User } from 'db-interface/Core';

@Module({
	imports: [MessageModule, ChannelModule, UserChannelModule, UserModule, TypeOrmModule.forFeature([User])],
	providers: [ChatGateway]
})
export class ChatModule {}
