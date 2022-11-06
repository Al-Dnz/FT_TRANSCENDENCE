import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStats, Avatar } from 'db-interface/Core';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { QueryFilterDto } from 'validation/query.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    create(createUserDto: CreateUserDto, avatarPath: string): Promise<User> {
        let user = new User(createUserDto.username);
        user.avatars = [new Avatar(avatarPath, true)];
        return this.userRepository.save(user);
    }

    findAll(query: QueryFilterDto): Promise<User[]> {
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

    updateByLogin(
        login: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UpdateResult> {
        return this.userRepository.update(
            { login: login },
            { userName: updateUserDto.username, twoFa: updateUserDto.two_fa },
        );
    }

    removeByLogin(login: string): Promise<DeleteResult> {
        return this.userRepository.delete({ login: login });
    }
}
