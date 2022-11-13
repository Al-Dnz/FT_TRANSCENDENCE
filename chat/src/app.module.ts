import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './chat/channel/channel.module';
import { Channel } from './chat/channel/channel.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
	TypeOrmModule.forFeature([Channel]),
	ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',//process.env.POSTGRES_HOST,
      port: 5432,
      username: 'root',//process.env.POSTGRES_USER,
      password: 'root',//process.env.POSTGRES_PASSWORD,
      database: 'transcendencedb',//process.env.POSTGRES_DB,
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
