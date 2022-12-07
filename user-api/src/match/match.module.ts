import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, User } from 'db-interface/Core';
import { UserService } from 'user-api/user.service';
import {JwtModule } from '@nestjs/jwt';


@Module({
    imports: [JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }), TypeOrmModule.forFeature([User, Match])],
    controllers: [MatchController],
    providers: [MatchService, UserService],
})
export class MatchModule { }
