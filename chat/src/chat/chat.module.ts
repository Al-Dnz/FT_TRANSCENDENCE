import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';
// import { UserModule } from 'src/user/user.module';
// import { UserModule } from './user/user.module';
import { UserChannelModule } from './user-channel/user-channel.module';

@Module({
	imports: [MessageModule, ChannelModule, UserChannelModule]})
export class ChatModule {}
