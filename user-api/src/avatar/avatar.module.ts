import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UserService } from 'user-api/user.service';
import { AvatarController } from './avatar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar, User, UserStats } from 'db-interface/Core';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserStats, Avatar])],
    controllers: [AvatarController],
    providers: [AvatarService, UserService],
})
export class AvatarModule { }
