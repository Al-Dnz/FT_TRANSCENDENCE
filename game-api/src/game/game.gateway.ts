import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { Position } from './game_interface';
import { GameService } from './game.service';
import { makeid, generateUUID } from './utils';
import { Sprite } from './gameClass';
import { fips } from 'crypto';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UserService } from 'src/user/user.service';
import { MatchService } from 'src/match/match.service';
import { MatchStatus, User, UserStatus } from 'db-interface/Core';

import { UsePipes } from '@nestjs/common';
import { WSPipe } from 'src/exception/websockets/ws-exception-filter'

@UsePipes(WSPipe)
@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway 
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private gameService: GameService,
				private userService: UserService,
				private matchService: MatchService) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	state = {};
	clientRooms = {};
	openRooms: string[] = [];

	stateCustom = {};
	clientRoomsCustom = {};
	openRoomsCustom: string[] = [];
	
	// io = require('socket.io')();
	// -----------


	async updateStatus(userLogin: string, status: UserStatus)
	{
		const user: User = await this.userService.getUserByLogin(userLogin); 
		this.userService.updateUserStatus(user, status)
		this.server.emit('userStatus', {login: user.login, status: user.status});
	}

	async sendLiveMatches()
	{
		const matches = await this.matchService.findLiveMatches();
		await this.server.emit('liveMatches', matches);
	}

	updateLiveMatches()
	{
		this.server.emit('updateLiveMatches', {id: 0});
	}

	@SubscribeMessage('MovePaddleToServer')
	async handlePaddle(client: Socket, instruction : string): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			if (this.state[this.clientRooms[user.login]]) {
				if (user.login === this.state[this.clientRooms[user.login]].game_data.idPlayers.player1) {
						this.state[this.clientRooms[user.login]].movementPaddle(this.state[this.clientRooms[user.login]].game_data.paddle1, instruction);
						this.server.to(this.clientRooms[user.login]).emit(`paddle1ToClient`, this.state[this.clientRooms[user.login]].game_data);
				} else if (user.login === this.state[this.clientRooms[user.login]].game_data.idPlayers.player2) {
						this.state[this.clientRooms[user.login]].movementPaddle(this.state[this.clientRooms[user.login]].game_data.paddle2, instruction);
						this.server.to(this.clientRooms[user.login]).emit(`paddle2ToClient`, this.state[this.clientRooms[user.login]].game_data);
				}
			} else if (this.stateCustom[this.clientRoomsCustom[user.login]]) {
				if (user.login === this.stateCustom[this.clientRoomsCustom[user.login]].game_data.idPlayers.player1) {
					this.stateCustom[this.clientRoomsCustom[user.login]].movementPaddle(this.stateCustom[this.clientRoomsCustom[user.login]].game_data.paddle1, instruction);
					this.server.to(this.clientRoomsCustom[user.login]).emit(`paddle1ToClient`, this.stateCustom[this.clientRooms[user.login]].game_data);
				} else if (user.login === this.stateCustom[this.clientRoomsCustom[user.login]].game_data.idPlayers.player2) {
					this.stateCustom[this.clientRoomsCustom[user.login]].movementPaddle(this.stateCustom[this.clientRoomsCustom[user.login]].game_data.paddle2, instruction);
					this.server.to(this.clientRoomsCustom[user.login]).emit(`paddle2ToClient`, this.stateCustom[this.clientRoomsCustom[user.login]].game_data);
			}
		}
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}

		
	}

	@SubscribeMessage('getInfoToServer')
	async GetInfos(client: Socket): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			if (this.state[this.clientRooms[user.login]]) {
			console.log(user.login , this.state[this.clientRooms[user.login]].game_data.paddle1.position);
				this.server.to(this.clientRooms[user.login]).emit(`getInfoToClient`, this.state[this.clientRooms[user.login]].game_data);
			}
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	@SubscribeMessage('newGame')
	async handleNewGame(client: Socket): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			console.log('handleNewGame');
			if (this.clientRooms[user.login]) {
				return;
			}

			let roomName = await this.matchService.generateGameCode();
			this.clientRooms[user.login] = roomName;
			client.emit('gameCode', roomName);

			// create match in db
			const match = await this.matchService.create(user, roomName, false);
			this.updateStatus(user.login, UserStatus.in_game);

			this.state[roomName] = new GameService(this.matchService);
	
			this.state[roomName].game_data.idPlayers.player1 = user.login;
			client.join(roomName);
			console.log('client.rooms.size', client.rooms);
			this.server.to(roomName).emit('init', this.state[roomName].game_data.idPlayers);
			this.openRooms.push(roomName);
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}


	}

	@SubscribeMessage('getSizeToServer')
	async GetSize(client: Socket): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			if (this.state[this.clientRooms[user.login]])
				this.server.to(this.clientRooms[user.login]).emit(`getSizeToClient`, this.state[this.clientRooms[user.login]].game_data);
			else if (this.stateCustom[this.clientRoomsCustom[user.login]]) {
				this.server.to(this.clientRoomsCustom[user.login]).emit(`getSizeToClient`, this.stateCustom[this.clientRoomsCustom[user.login]].game_data);
			}
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	@SubscribeMessage('joinGame')
	async handleJoinGame(client: Socket, gameCode: string): Promise<void>
	{

		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			
			// if game doesn't exist 
			if (!this.state[gameCode]) {
				client.emit('unknownGame', this.clientRooms);
				return;
			}
			// if game is full
			if (this.state[gameCode].game_data.idPlayers.player2 &&
				this.state[gameCode].game_data.idPlayers.player2 != user.login)
			{
				client.emit('fullGame');
				return;
			}

			this.clientRooms[user.login] = gameCode;
			client.join(gameCode);
			this.state[gameCode].game_data.idPlayers.player2 = user.login;
	
			client.emit('gameCode', gameCode);
			this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
			// client.emit('startGame');
			if (this.state[gameCode].game_data.idPlayers.player1 && this.state[gameCode].game_data.idPlayers.player2) {
				setTimeout(() => {
					this.startGameInterval(client, this.state[gameCode], gameCode, this.clientRooms);
				}, 500);
			}
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	@SubscribeMessage('specGame')
	async handleSpecGame(client: Socket, gameCode: string): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
		// 
			if (!this.state[gameCode]) {
				client.emit('unknownGame');
				return;
			}
			this.clientRooms[user.login] = gameCode;
			client.join(gameCode);
			client.emit('gameCode', gameCode);
			this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
		}
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}


	@SubscribeMessage('InvGame')
	async handleInvGame(client: Socket, gameCode: string): Promise<void>
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			//----------------------//
			if (!gameCode) {
				client.emit('errFindGame');
				return;
			}
			if (this.clientRooms[user.login]) {
				return;
			}
			if (!this.state[gameCode]) {
				this.clientRooms[user.login] = gameCode;
				client.emit('gameCode', gameCode);
				client.emit('test');
			// create match in db
			    const match = await this.matchService.create(user, gameCode, false);
			    this.updateStatus(user.login, UserStatus.in_game);

				this.state[gameCode] = new GameService(this.matchService);

				this.state[gameCode].game_data.idPlayers.player1 = user.login;
				client.join(gameCode);
				this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
			} else {
				client.emit('test');
				this.clientRooms[user.login] = gameCode;
				client.join(gameCode);
				this.state[gameCode].game_data.idPlayers.player2 = user.login;
		
				const match = await this.matchService.findByGameCode(gameCode);
				await this.matchService.updateMatchCreation(match, user);
				await this.matchService.updateMatchStatus(match, MatchStatus.live);
				this.updateStatus(user.login, UserStatus.in_game);
				this.sendLiveMatches();

				client.emit('gameCode', gameCode);
				this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
				// client.emit('startGame');
				this.server.to(gameCode).emit(`startGame`);
			if (this.state[gameCode].game_data.idPlayers.player1 && this.state[gameCode].game_data.idPlayers.player2) {
				setTimeout(() => {
					this.startGameInterval(client, this.state[gameCode], gameCode, this.clientRooms);
				}, 500);
			}
			}
		}
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	@SubscribeMessage('findGame')
	async handleFindGame(client: Socket): Promise<void>
	{
		console.log("handleFindGame 1 :", this.state);
		console.log("handleFindGame 2 :", this.clientRooms);
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			let gameCode = "";
			if (!this.clientRooms[user.login]) {
				console.log(this.openRooms);
				if (!this.openRooms.length) {
					console.log("void", this.openRooms.length);
					this.handleNewGame(client);
					return;
				}
				if (!this.openRooms[0]) {
					client.emit("errFindGame");
					return;
				}
				gameCode = this.openRooms[0];

				const match = await this.matchService.findByGameCode(gameCode);
				await this.matchService.updateMatchCreation(match, user);
				await this.matchService.updateMatchStatus(match, MatchStatus.live)
				this.updateStatus(user.login, UserStatus.in_game);
				this.sendLiveMatches();

				this.clientRooms[user.login] = gameCode;
				this.state[gameCode].game_data.idPlayers.player2 = user.login;
				this.openRooms.shift();
				client.join(gameCode);
				client.emit('gameCode', gameCode);
				this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
				this.server.to(this.clientRooms[user.login]).emit(`startGame`);
				setTimeout(() => {
					this.startGameInterval(client, this.state[gameCode], gameCode, this.clientRooms);
				}, 500);
			} else {

				//reconnect
				gameCode = this.clientRooms[user.login];
				this.updateStatus(user.login, UserStatus.in_game);
				client.emit('test');
				client.join(gameCode);
				client.emit('gameCode', gameCode);
				this.server.to(gameCode).emit('init', this.state[gameCode].game_data.idPlayers);
				if (this.state[this.clientRooms[user.login]].game_data.gameState === 'on')
				this.server.to(this.clientRooms[user.login]).emit(`startGame`);
			}
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	@SubscribeMessage('leaveGame')
	async handleLeaveGame(client: Socket): Promise<void>
	{
		client.emit('gameOver');
		this.server.to(this.clientRooms[client.id]).emit(`gameOver`);
	}



	async startGameInterval(client, state, gameCode, clientRooms) {
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			this.state[gameCode].game_data.gameState = 'on';
			const intervalID = setInterval(() => {
				const winner = state.gameLoop(state);
			if (!winner) {
				this.server.to(clientRooms[user.login]).emit('gameState', state.game_data);
			}
			else
			{
				console.log("1 ",this.clientRooms);
				this.server.to(clientRooms[user.login]).emit('gameOver');

				if (this.clientRooms[this.state[gameCode].game_data.idPlayers.player1] || this.clientRooms[this.state[gameCode].game_data.idPlayers.player2]) {
					this.clientRooms[this.state[gameCode].game_data.idPlayers.player1] = null;
					this.clientRooms[this.state[gameCode].game_data.idPlayers.player2] = null;
				}
				
				this.matchService.updateFinishedGame(gameCode, state.game_data.score.player1, state.game_data.score.player2);
				
				const login1 = this.state[gameCode].game_data.idPlayers.player1;
				const login2 = this.state[gameCode].game_data.idPlayers.player2;
				this.updateStatus(login1, UserStatus.online);
				this.updateStatus(login2, UserStatus.online);
				
				

				if (this.state[gameCode]) {
				delete this.state[gameCode].game_data.ball;
				delete this.state[gameCode].game_data.paddle1;
				delete this.state[gameCode].game_data.paddle2;
				delete this.state[gameCode];
				}
				this.updateLiveMatches();
				clearInterval(intervalID);
				// return; 
			}
		}, 1000 / 60);
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
	}

	//---------------------------------------------------------------------------

	@SubscribeMessage('getInfoCustomToServer')
	async GetInfosCustom(client: Socket): Promise<void>
	{
		if (this.stateCustom[this.clientRoomsCustom[client.id]]) {
		console.log(client.id , this.state[this.clientRoomsCustom[client.id]].game_data.paddle1.position);
			this.server.to(this.clientRoomsCustom[client.id]).emit(`getInfoToClient`, this.stateCustom[this.clientRoomsCustom[client.id]].game_data);
		}
	}

	@SubscribeMessage('newGameCustom')
	async handleNewGameCustom(client: Socket): Promise<void>
	{
		console.log('handleNewGame');
		// let roomName = makeid(5);
		let roomName = await this.matchService.generateGameCode();
		
		this.clientRoomsCustom[client.id] = roomName;
		client.emit('gameCode', roomName);

		this.stateCustom[roomName] = new GameService(this.matchService);

		// const match = await this.matchService.create(user, roomName, true);

		this.stateCustom[roomName].game_data.idPlayers.player1 = client.id;
		this.stateCustom[roomName].game_data.mode = "custom";
		client.join(roomName);
		console.log('client.rooms.size', client.rooms);
		this.server.to(roomName).emit('init', this.state[roomName].game_data.idPlayers);
		this.openRoomsCustom.push(roomName);
	}

	@SubscribeMessage('findGameCustom')
	async handleFindGameCustom(client: Socket): Promise<void>
	{
		let gameCode = "";
		console.log(this.openRoomsCustom);
		if (!this.openRoomsCustom.length) {
			console.log("void", this.openRoomsCustom.length);
			this.handleNewGameCustom(client);
			return;
		}
		if (!this.openRoomsCustom[0]) {
			client.emit("errFindGame");
			return;
		}
		gameCode = this.openRoomsCustom[0];
		this.clientRoomsCustom[client.id] = gameCode;
		client.join(gameCode);
		this.stateCustom[gameCode].game_data.idPlayers.player2 = client.id;
		client.emit('gameCode', gameCode);
		client.emit('init', this.state[gameCode].game_data.idPlayers);
		this.openRoomsCustom.shift();
		this.server.to(this.clientRoomsCustom[client.id]).emit(`startGameCustom`);
		setTimeout(() => {
			this.startGameInterval(client, this.stateCustom[gameCode], gameCode, this.clientRoomsCustom);
		}, 500);
	}





	///-------------------connection----------------------------------------------------

	async handleConnection(client: Socket, ...args: any[])
	{
		try
		{
			console.log("handleConnection");
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			this.userService.updateUserSocket(user, client.id);
			this.logger.log(`User: ${user.login} is connected to game with socket ${client.id}`);
			console.log("this.state", this.state);
			console.log("this.clientRooms", this.clientRooms);
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}

		this.server.emit(`gameData`, this.gameService.game_data);
		this.server.emit(`positionToClient`, this.gameService.game_data);
	}

	async handleDisconnect(client: Socket, ...args: any[])
	{
		try
		{
			console.log("handleDisconnect", this.clientRooms);
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			if (this.state[this.clientRooms[user.login]] && this.state[this.clientRooms[user.login]].game_data.gameState === 'off') {
				let tmp = this.clientRooms[user.login]; // tmp = gamecode;
				this.clientRooms[this.state[tmp].game_data.idPlayers.player1] = null;
				delete this.clientRooms[this.state[tmp].game_data.idPlayers.player1];
				this.state[tmp] = null;
				delete this.state[tmp];
				const index = this.openRooms.indexOf(tmp);
				if (index > -1) { // only splice array when item is found
					this.openRooms.splice(index, 1); // 2nd parameter means remove one item only
				}
				// remove empty deleted match
				this.matchService.removeByGameCode(tmp);
				this.updateStatus(user.login, UserStatus.online);
			}
			
		} 
		catch (error)
		{
			this.server.to(client.id).emit('gameError', error.message);
			client.disconnect();
		}
		this.server.to(this.clientRooms[client.id]).emit('test');
	}

	afterInit(server: Server){}
}
