import {
    Entity,
    Column,
    Index,
    ManyToMany,
    JoinTable,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
} from "typeorm";

import { Min } from "class-validator";

import { Base } from "./Base";

/**********************************************************************************************
 *                                     Custom types
 **********************************************************************************************/

export enum UserStatus {
    online = "online",
    offline = "offline",
    in_game = "in_game",
    in_queue = "in_queue",
    afk = "afk",
}

export enum UserMatchRole {
    player_one = "player_one",
    player_two = "player_two",
    guest = "guest",
}

export enum UserChannelRole {
    member = "member",
    admin = "admin",
    owner = "owner",
}

export enum UserChannelStatus {
    pending = "pending",
    accepted = "accepted",
}

export enum ChannelType {
    public = "public",
    private = "private",
    protected = "protected",
    direct = "direct",
}

/**********************************************************************************************
 *                                     Entities
 **********************************************************************************************/

@Entity()
export class User extends Base {
    @Index("login-idx")
    @Column({ unique: true })
    login: string;

    @Index("username-idx")
    @Column({ unique: true })
    userName: string;

    @Column("boolean", { default: false })
    twoFa: boolean;

    @Column({ type: "enum", enum: UserStatus, default: UserStatus.offline })
    status: UserStatus;

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    friends: User[];

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    blockedUser: User[];

    @OneToMany(() => Avatar, (avatar: Avatar) => avatar.user, {
        cascade: true,
    })
    avatars: Avatar[];

    @OneToOne(() => Avatar, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    actualAvatar: Avatar;

    @OneToOne(() => UserStats, (stats: UserStats) => stats.user, {
        onDelete: "RESTRICT",
    })
    @JoinColumn()
    stats: UserStats;

    @OneToMany(() => UserMatch, (userMatch: UserMatch) => userMatch.user, {
        cascade: true,
    })
    userMatchs: UserMatch[];

    @OneToMany(
        () => UserChannel,
        (userChannel: UserChannel) => userChannel.user,
        {
            cascade: true,
        }
    )
    userChannels: UserChannel[];
}

@Entity()
export class Avatar extends Base {
    @Index("path-idx")
    @Column({ unique: true })
    path: string;

    @ManyToOne(() => User, (user: User) => user.avatars, { onDelete: "CASCADE" })
    user: User;
}

@Entity()
export class UserStats extends Base {
    @Column()
    @Min(0)
    level: number;

    @Column()
    @Min(0)
    victories: number;

    @Column()
    @Min(0)
    defeats: number;

    @OneToOne(() => User, (user: User) => user.stats, { onDelete: "CASCADE" })
    user: User;
}

@Entity()
export class Match extends Base {
    @OneToOne(() => UserMatch, (userMatch: UserMatch) => userMatch.match)
    userMatch: UserMatch;

    @Column({ type: "date" })
    finishedAt: Date;

    @OneToOne(() => UserMatch, { onDelete: "SET NULL", nullable: true })
    winner: UserMatch;
}

@Entity()
export class UserMatch extends Base {
    @ManyToOne(() => User, (user: User) => user.userMatchs, {
        onDelete: "CASCADE",
    })
    user: User;

    @OneToOne(() => Match, { onDelete: "CASCADE" })
    @JoinColumn()
    match: Match;

    @Column()
    @Min(0)
    score: number;

    @Column()
    role: UserMatchRole;
}

@Entity()
export class Channel extends Base {
    @OneToMany(
        () => UserChannel,
        (userChannel: UserChannel) => userChannel.channel
    )
    members: UserChannel[];

    @OneToOne(() => UserChannel)
    createdBy: UserChannel;

    @OneToMany(() => Message, (message: Message) => message.channel, {
        cascade: true,
    })
    messages: Message[];

    @Column()
    type: ChannelType;

    @Column({ nullable: true })
    password: string;
}

@Entity()
export class UserChannel extends Base {
    @Column()
    role: UserChannelRole;

    @Column()
    status: UserChannelStatus;

    @ManyToOne(() => Channel, (channel: Channel) => channel.members, {
        onDelete: "CASCADE",
    })
    channel: Channel;

    @ManyToOne(() => User, (user: User) => user.userChannels, {
        onDelete: "CASCADE",
    })
    user: User;

    @OneToOne(() => UserChannel)
    mutedBy: UserChannel;
}

@Entity()
export class Message extends Base {
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    content: string;

    @OneToOne(() => UserChannel)
    sentBy: UserChannel;

    @ManyToOne(() => Channel, (channel: Channel) => channel.messages, {
        onDelete: "CASCADE",
    })
    channel: Channel;
}
