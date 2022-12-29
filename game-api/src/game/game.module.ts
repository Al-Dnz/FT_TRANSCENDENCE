import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 

import { UserModule } from '../user/user.module';
import { MatchModule } from '../match/match.module';
import { UserMatchModule } from '../user-match/user-match.module';

import { GameService } from './game.service';


@Module({
	imports: [MatchModule, UserModule, UserMatchModule],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {
}
