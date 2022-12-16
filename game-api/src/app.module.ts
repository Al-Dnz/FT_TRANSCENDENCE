import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import {
  User,
  UserMatch,
  Match,
  Channel,
  UserChannel,
  UserStats,
  Message,
  Avatar,
  UserSettings,
  BannedChan,
} from 'db-interface/Core';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User, Avatar]),
	ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
	  entities: [
		            Avatar,
                Match,
                UserMatch,
                Channel,
                UserChannel,
                Message,
                UserStats,
                User,
                UserSettings,
                BannedChan,
	],
      autoLoadEntities: true,
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService, GameGateway, GameService],
})
export class AppModule {}
