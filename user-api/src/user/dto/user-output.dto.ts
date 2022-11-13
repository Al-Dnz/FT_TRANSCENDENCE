import { InternalServerErrorException } from '@nestjs/common';
import { Avatar, User, UserStats, UserStatus } from 'db-interface/Core';

class UserStatsOutputDto {
    constructor(stats: UserStats) {
        this.id = stats.id;
        this.level = stats.level;
        this.defeats = stats.defeats;
        this.victories = stats.victories;
    }
    id: number;
    level: number;
    victories: number;
    defeats: number;
}

class ActualAvatarOutputDto {
    constructor(avatars: Avatar[]) {
        let actual_avatar: Avatar[] = avatars.filter((value: Avatar) => {
            return value.activate ? value : undefined;
        });

        if (actual_avatar.length !== 1) {
            throw new InternalServerErrorException(
                `${actual_avatar.length} avatar activated`,
            );
        }
        this.id = actual_avatar[0].id;
        this.path = actual_avatar[0].path;
    }
    id: number;
    path: string;
}

export class UserOutputDto {
    constructor(user: User) {
        this.stats = new UserStatsOutputDto(user.stats);
        this.login = user.login;
        this.username = user.userName;
        this.two_fa = user.twoFa;
        this.actual_avatar = new ActualAvatarOutputDto(user.avatars);
        this.status = user.status;
    }
    login: string;
    actual_avatar: ActualAvatarOutputDto;
    username: string;
    two_fa: boolean;
    stats: UserStatsOutputDto;
    status: UserStatus;
}
