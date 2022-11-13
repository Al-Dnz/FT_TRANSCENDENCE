import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Avatar } from 'db-interface/Core';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { QueryFilterDto } from 'validation/query.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>, // @InjectRepository(Match) // private matchRepository: Repository<Match>,
    ) { }

    create(login: string, avatarPath: string): Promise<User> {
        let user = new User(login);
        user.avatars = [new Avatar(avatarPath, true)];
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

        let friends: User[] = user.friends.slice(query.onset, query.length);
        if (query.search) {
            return friends.map((value: User) =>
                value.userName.includes(query.search) ? value : undefined,
            );
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

    // async listMatchByUserID(
    //     login: string,
    //     query: QueryFilterDto,
    // ): Promise<Match[]> {
    //     return this.matchRepository.find({
    //         skip: query.onset,
    //         take: query.length,
    //         where: { participants: Equal(login) },
    //         relations: {
    //             participants: true,
    //         },
    //     });
    // }
}
