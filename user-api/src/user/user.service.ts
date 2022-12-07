import { Injectable,  UnauthorizedException, } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Avatar, UserStatus } from 'db-interface/Core';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { QueryFilterDto } from 'validation/query.dto';

import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from './interface/token.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  private logger: Logger = new Logger('UserService');

  create(login: string, avatarPath: string): Promise<User> {
    let user = new User(login);
    user.avatar = new Avatar(avatarPath);
    return this.userRepository.save(user);
  }

  list(query: QueryFilterDto): Promise<User[]> {
    return this.userRepository.find({
      skip: query.onset,
      take: query.length,
      where: query.search
        ? {
            userName: Like(`%${query.search}%`),
          }
        : undefined,
      relations: {
        stats: true,
      },
    });
  }

  findOne(login: string): Promise<User> {
    return this.userRepository.findOneBy({ login: login });
  }

  updateOne(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    user.userName = updateUserDto.username
      ? updateUserDto.username
      : user.userName;
    user.settings.mapId = updateUserDto.settings
      ? updateUserDto.settings.map_id
      : user.settings.mapId;
    user.settings.twoFa = updateUserDto.settings
      ? updateUserDto.settings.two_fa
      : user.settings.twoFa;
    user.settings.paddleId = updateUserDto.settings
      ? updateUserDto.settings.paddle_id
      : user.settings.paddleId;

    return this.userRepository.save(user);
  }

  removeByLogin(login: string): Promise<DeleteResult> {
    return this.userRepository.delete({ login: login });
  }

  async findFriends(userLogin: string, query: QueryFilterDto): Promise<User[]> {
    let user: User = await this.userRepository.findOne({
      where: {
        login: userLogin,
      },
      relations: {
        friends: true,
      },
    });

    let friends: User[] = user.friends.slice(query.onset, query.length);
    if (query.search) {
      return friends.filter((value: User) =>
        value.userName.includes(query.search) ? value : undefined,
      );
    }
    return friends;
  }

  async addFriends(userLogin: string, friendLogin: string): Promise<void> {
    const userOne = await this.findOne(userLogin);
    const userTwo = await this.findOne(friendLogin);
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'friends')
      .of(userOne)
      .add(userTwo);
  }

  async removeFriends(userLogin: string, friendLogin: string): Promise<void> {
    const userOne = await this.findOne(userLogin);
    const userTwo = await this.findOne(friendLogin);
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'friends')
      .of(userOne)
      .remove(userTwo);
  }

  async getUserByToken(token: string)
	{ 
		const decoded = this.jwtService.decode(token) as IToken;
		const user = await this.userRepository.findOneBy({ login: decoded.login });
		if (!user)
			throw new HttpException(`User ${decoded.login} not found`, HttpStatus.NOT_FOUND);
		return user
	}

  async updateUserStatus(user: User, status: UserStatus, socketId?: string)
  {
    user.globalSocketId = socketId || user.globalSocketId;
    user.status = status;
    this.userRepository.save(user);
  }

  async getUserBySocketId(socket: string)
  {
    const user = await this.userRepository
      .createQueryBuilder()
      .select("user") 
      .from(User, "user") 
      .where("user.globalSocketId = :socketId", { socketId: socket })
      .getOne();
    if (!user)
      throw new HttpException(`User with global socket #${socket} not found`, HttpStatus.NOT_FOUND);
    return user;
  }
}
