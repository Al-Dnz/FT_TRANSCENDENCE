import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';
// import { UserModule } from 'src/user/user.module';

@Module({
	imports: [MessageModule, ChannelModule]})
export class ChatModule {}
