import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Avatar } from 'db-interface/Core';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { QueryFilterDto } from 'validation/query.dto';
import { length } from 'class-validator';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
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

    async findFriends(userLogin: string, query: QueryFilterDto): Promise<User[]> {
        let user: User = await this.userRepository.findOne({
            where: {
                login: userLogin,
            },
            relations: {
                friends: true,
            },
        });

        let friends: User[] = user.friends;

        friends =
            query.onset && query.onset < friends.length
                ? friends.slice(query.onset, friends.length)
                : [];
        friends =
            query.length && query.length < friends.length
                ? friends.slice(0, query.length)
                : friends;
        if (query.search) {
            return friends.map((value: User) => {
                return value.userName.includes(query.search) ? value : undefined;
            });
        }
        return friends;
    }

    async addFriends(userLogin: string, friendLogin: string): Promise<void> {
        await this.userRepository
            .createQueryBuilder()
            .relation(User, 'friends')
            .of({ login: userLogin })
            .add({ login: friendLogin });
    }

    async removeFriends(userLogin: string, friendLogin: string): Promise<void> {
        await this.userRepository
            .createQueryBuilder()
            .relation(User, 'friends')
            .of({ login: userLogin })
            .remove({ login: friendLogin });
    }

    async listAvatars(login: string, query: QueryFilterDto): Promise<Avatar[]> {
        let user: User = await this.userRepository.findOne({
            where: {
                login: login,
            },
            relations: {
                avatars: true,
            },
        });

        let avatars: Avatar[] = user.avatars;

        avatars =
            query.onset && query.onset < avatars.length
                ? avatars.slice(query.onset, avatars.length)
                : [];
        return query.length && query.length < avatars.length
            ? avatars.slice(0, query.length)
            : avatars;
    }
}
