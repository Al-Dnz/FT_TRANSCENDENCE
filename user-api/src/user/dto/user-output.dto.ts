import { InternalServerErrorException } from '@nestjs/common';
import { Avatar, User, UserStats } from 'db-interface/Core';

export class UserStatsOutputDto {
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

export class AvatarOutputDto {
    constructor(avatars: Avatar[]) {
        let actual_avatar: Avatar[] = avatars.map((value: Avatar) => {
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
        this.id = user.id;
        this.username = user.userName;
        this.two_fa = user.twoFa;
        this.actual_avatar = new AvatarOutputDto(user.avatars);
    }
    id: number;
    actual_avatar: AvatarOutputDto;
    username: string;
    two_fa: boolean;
    stats: UserStatsOutputDto;
}
