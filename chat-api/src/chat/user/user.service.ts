import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import { User } from 'db-interface/Core';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { IToken } from '../interface/token.interface';



@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly jwtService: JwtService
	  ) {}
	
	private logger: Logger = new Logger('UserService(Chat)');

	checkToken(token: string)
	{
		const validated = this.jwtService.verify(token);
		if (!validated)
			throw new HttpException(`Invalid token`, HttpStatus.FORBIDDEN);
		return validated;
	}

	async getUserByToken(token: string)
	{ 
		const decoded = this.jwtService.decode(token) as IToken;
		const user = await this.usersRepository.findOneBy({ login: decoded.login });
		if (!user)
			throw new HttpException(`User ${decoded.login} not found`, HttpStatus.NOT_FOUND);
		return user
	}

	async getUserById(id: number)
	{ 
		const user = await this.usersRepository.findOneBy({ id: id });
		if (!user)
			throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
		return user
	}

	async updateUserSocket(user: User, socketId: string)
	{
		user.chatSocketId = socketId;
		this.usersRepository.save(user);
	}

	// async getUserByChatSocket(socketId: string): Promise<User>
	// {
	// 	const user = await this.usersRepository.find({select: {chatSocketId: socketId}});
	// 	if (!user)
	// 		throw new HttpException(`User with chat_socket_id: ${socketId} not found`, HttpStatus.NOT_FOUND);
	// 	return user[0];
	// }



}
