import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {Match ,User} from 'db-interface/Core';

@Injectable()
export class MatchService {

	constructor(
		@InjectRepository(Match)
		private readonly matchesRepository: Repository<Match>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	  ) {}

	  private logger: Logger = new Logger('MacthService');

	async create(playerOne: User, gameCode: string, custom?: boolean): Promise<Match> 
  	{
		let match =  new Match();
		match.playerOne = playerOne;
		match.gameCode = gameCode;
		match.custom = custom;
		return await this.matchesRepository.save(match);
	}

	async updateMatchCreation(match: Match, playerTwo: User): Promise<Match>
	{
		match.playerTwo = playerTwo;
		match.full = true;
		return await this.matchesRepository.save(match);
	}

	async updateScore(match: Match, score1?: number, score2?: number): Promise<Match>
	{
		match.score1 = score1;
		match.score2 = score2;
		return await this.matchesRepository.save(match);
	}

	async findAll(): Promise<Match[]> 
	{
		return await this.matchesRepository.find({ relations: ["playerOne", "playerTwo"] });
	}
	
	async findOne(id: number)
	{
	  const match = await this.matchesRepository.findOneBy({ id: id })
	  if (!match)
		  throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
	  return match;
	}

	async findByGameCode(gameCode: string)
	{
		const match = await this.matchesRepository.findOneBy({ gameCode: gameCode })
		if (!match)
			throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
		return match;
	}
}

