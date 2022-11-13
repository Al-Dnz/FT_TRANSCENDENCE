import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, User } from 'db-interface/Core';
import { UserService } from 'user-api/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Match])],
    controllers: [MatchController],
    providers: [MatchService, UserService],
})
export class MatchModule { }
