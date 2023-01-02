import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus, User } from 'db-interface/Core';
import { Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { MatchService } from './match/match.service';


@Injectable()
export class AppService {

  constructor(
    private userService: UserService,
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
    private matchService: MatchService) { }

  private logger: Logger = new Logger('onApplicationBootstrap');

  async createMatch(login1: string, login2: string, status: MatchStatus) {
    const playerOne = await this.userService.getUserByLogin(login1);
    const playerTwo = await this.userService.getUserByLogin(login2);
    const gameCode = await this.matchService.generateGameCode();

    let match = await this.matchesRepository.findOneBy({ gameCode: gameCode })

    if (!match) {
      const match = new Match();
      match.playerOne = playerOne;
      match.playerTwo = playerTwo;
      match.gameCode = gameCode;
      match.status = status;
      this.matchesRepository.save(match);
    }

  }

  async onApplicationBootstrap() {
    const login1 = 'myoyo';
    const login2 = 'pmartinezi';
    const login3 = 'gbaltring';
    const login4 = 'malik';

    try 
    {
      // await this.createMatch(login1, login2, MatchStatus.finished);
      // await this.createMatch(login3, login2, MatchStatus.finished);
      // await this.createMatch(login1, login4, MatchStatus.finished);
      // await this.createMatch(login4, login3, MatchStatus.finished);

      this.logger.log(`Creation of seed macth`);
    } catch (error) {}
  }

}
