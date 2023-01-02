import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Match, User, UserStats } from 'db-interface/Core';
import { MatchStatus } from 'db-interface/Core';
import { generateUUID } from 'src/game/utils';

@Injectable()
export class MatchService {

	constructor(
		@InjectRepository(Match)
		private readonly matchesRepository: Repository<Match>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(UserStats)
		private readonly statsRepository: Repository<UserStats>,
	) { }

	private logger: Logger = new Logger('MacthService');

	async create(playerOne: User, gameCode: string, custom?: boolean): Promise<Match> {
		let match = new Match();
		match.playerOne = playerOne;
		match.gameCode = gameCode;
		match.custom = custom;
		return await this.matchesRepository.save(match);
	}

	async updateMatchCreation(match: Match, playerTwo: User): Promise<Match> {
		match.playerTwo = playerTwo;
		return await this.matchesRepository.save(match);
	}


	async updateMatchStatus(match: Match, status: MatchStatus): Promise<Match> {
		match.status = status;
		return await this.matchesRepository.save(match);
	}

	async updateScore(match: Match, score1?: number, score2?: number): Promise<Match> {
		match.score1 = score1;
		match.score2 = score2;
		return await this.matchesRepository.save(match);
	}

	async updateFinishedGame(gameCode: string, score1?: number, score2?: number): Promise<Match> {
		const match = await this.matchesRepository.findOneBy({ gameCode: gameCode })
		if (!match)
			throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
		match.score1 = score1;
		match.score2 = score2;
		match.finishedAt = new Date(Date.now());
		match.status = MatchStatus.finished;
		this.updatePlayerStats(match.playerOne, score1, match.playerTwo, match.score2);
		return this.matchesRepository.save(match);
	}

	async updatePlayerStats(playerOne: User, score1: number, playerTwo: User, score2: number)
	{
		let stats = playerOne.stats;
		if (score1 > score2)
			stats.victories++;
		else
			stats.defeats++;
		await this.updateElo(playerOne);
		this.statsRepository.save(stats);
		stats = playerTwo.stats;
		if (score2 > score1)
			stats.victories++;
		else
			stats.defeats++;
		await this.updateElo(playerTwo);	
		await this.statsRepository.save(stats);
	}

	async updateElo(player: User)
	{
		let stats = player.stats;
		stats.level = 3 * stats.victories - 2 * stats.defeats;
		await this.statsRepository.save(stats);
	}

	async findAll(): Promise<Match[]> {
		return await this.matchesRepository.find({ relations: ["playerOne", "playerTwo"] });
	}


	async findAllUnfinieshedMatches(): Promise<Match[]> {
		return await this.matchesRepository.find(
			{
				where:
				[
					{ status: MatchStatus.pending },
					{ status: MatchStatus.live },
					{ status: MatchStatus.requested },
				]
			});
	}

	async findOne(id: number) {
		const match = await this.matchesRepository.findOneBy({ id: id })
		if (!match)
			throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
		return match;
	}

	async findByGameCode(gameCode: string) {
		const match = await this.matchesRepository.findOneBy({ gameCode: gameCode })
		if (!match)
			throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
		return match;
	}

	async getUserMatchHistory(user: User) {
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: [
					{
						playerOne: { id: user.id },
						status: MatchStatus.finished
					},
					{
						playerTwo: { id: user.id },
						status: MatchStatus.finished
					},
				]
			})
		return matches;
	}

	async findLiveMatches() {
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: { status: MatchStatus.live }
			})
		return matches;
	}

	async generateGameCode() {
		let gameCode = generateUUID();
		let match = await this.matchesRepository.findOneBy({ gameCode: gameCode });
		while (match) {
			gameCode = generateUUID();
			match = await this.matchesRepository.findOneBy({ gameCode: gameCode });
		}
		return gameCode;
	}

	async removeByGameCode(gameCode: string) {
		const match = await this.matchesRepository.findOneBy({ gameCode: gameCode })
		if (!match)
			return;
		await this.matchesRepository.delete(match.id);
	}

	async remove(id: number) {
		const match = await this.matchesRepository.findOneBy({ id: id })
		if (!match)
			return;
		await this.matchesRepository.delete(match.id);
	}

	async findCurrentMatches(userOne: User, userTwo: User) {
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: [
					//p1 =u1
					{
						playerOne: { id: userOne.id },
						status: MatchStatus.pending
					},
					{
						playerOne: { id: userOne.id },
						status: MatchStatus.requested
					},
					{
						playerOne: { id: userOne.id },
						status: MatchStatus.live
					},
					//p1 = u2
					{
						playerOne: { id: userTwo.id },
						status: MatchStatus.pending
					},
					{
						playerOne: { id: userTwo.id },
						status: MatchStatus.requested
					},
					{
						playerOne: { id: userTwo.id },
						status: MatchStatus.live
					},
					//p2 = u1
					{
						playerTwo: { id: userOne.id },
						status: MatchStatus.requested
					},
					{
						playerTwo: { id: userOne.id },
						status: MatchStatus.live
					},
					//p2 = u2
					{
						playerTwo: { id: userTwo.id },
						status: MatchStatus.requested
					},
					{
						playerTwo: { id: userTwo.id },
						status: MatchStatus.live
					},
				]
			})
		return matches;
	}

	async isInGame(user: User): Promise<boolean>
	{
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: [
					{
						playerOne: { id: user.id },
						status: MatchStatus.live
					},
					{
						playerTwo: { id: user.id },
						status: MatchStatus.live
					},
				]
			});
		if (matches.length > 0)
			return true;
		return false;
	}

	async getGame(user: User): Promise<Match>
	{
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: [
					{
						playerOne: { id: user.id },
						status: MatchStatus.live
					},
					{
						playerTwo: { id: user.id },
						status: MatchStatus.live
					},
				]
			});
		if (matches.length == 0)
			throw new HttpException(`You are not in game`, HttpStatus.NOT_FOUND);
		return matches[0];
	}

	async isPlayerInGame(user: User): Promise<Match>
	{
		const matches = await this.matchesRepository.find(
			{
				relations: { playerOne: true, playerTwo: true },
				where: [
					{
						playerOne: { id: user.id },
						status: MatchStatus.live
					},
					{
						playerTwo: { id: user.id },
						status: MatchStatus.live
					},
				]
			});
		if (matches.length == 0)
			throw new HttpException(`${user.login} is not in game`, HttpStatus.NOT_FOUND);

		return matches[0];
	}
}

