import { Controller } from '@nestjs/common';
import { Post, Get, Body, Param, ValidationPipe } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { MatchStatus } from 'db-interface/Core';

import { UserService } from 'src/user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { GetMatchesDto } from './dto/get-matches.dto';
import { MatchService } from './match.service';

import { generateUUID } from 'src/game/utils';
import { AcceptMatchDto } from './dto/accept-match.dto';

@Controller('match')
export class MatchController {

	constructor(
		private macthService: MatchService,
		private userService: UserService,
	) { }

	@Get(':gameCode')
	async getOne(@Param('gameCode') gameCode: string)
	{
		return await this.macthService.findByGameCode(gameCode);
	}

	@Get('/history')
	async getMatchHistory(@Body() body: GetMatchesDto) {
		const token = body.token;
		let user;
		try {
			this.userService.checkToken(token);
			user = await this.userService.getUserByToken(token);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.FORBIDDEN);
		}
		return await this.macthService.getUserMatchHistory(user);
	}

	@Get('/live')
	async getLiveMatches(@Body() body: GetMatchesDto) {
		const token = body.token;
		let user;
		try {
			this.userService.checkToken(token);
			user = await this.userService.getUserByToken(token);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.FORBIDDEN);
		}
		return await this.macthService.findLiveMatches();
	}

	@Post('/create')
	async createMatch(@Body() body: CreateMatchDto) {
		const token = body.token;
		let userOne;
		try {
			this.userService.checkToken(token);
			userOne = await this.userService.getUserByToken(token);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.FORBIDDEN);
		}
		const userTwo = await this.userService.getUserByLogin(body.login);

		const currentMatches = await this.macthService.findCurrentMatches(userOne, userTwo);
		if (currentMatches.length != 0)
		{
			throw new HttpException("At least one user is busy", HttpStatus.FORBIDDEN);
		}

		const gameCode = await this.macthService.generateGameCode();
		const custom = body.custom;
		let match = await this.macthService.create(userOne, gameCode, custom);
		await this.macthService.updateMatchCreation(match, userTwo);
		await this.macthService.updateMatchStatus(match, MatchStatus.requested);
		return match;
	}

	@Post('/accept')
	async acceptMatch(@Body() body: AcceptMatchDto) {
		const token = body.token;
		let userTwo;
		try {
			this.userService.checkToken(token);
			userTwo = await this.userService.getUserByToken(token);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.FORBIDDEN);
		}
		let match = await this.macthService.findByGameCode(body.gameCode);
		if (match.playerTwo != userTwo)
			throw new HttpException(`${userTwo.login} is not invited at this match`, HttpStatus.FORBIDDEN);

		if (body.accepted == true) {
			await this.macthService.updateMatchStatus(match, MatchStatus.live)
			return match;
		}
		else {
			await this.macthService.removeByGameCode(body.gameCode)
			throw new HttpException('Request Refused', HttpStatus.NOT_ACCEPTABLE);
		}
	}

}
