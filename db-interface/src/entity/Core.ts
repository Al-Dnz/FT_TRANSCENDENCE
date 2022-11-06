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
    Relation,
    PrimaryColumn,
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
export class Match extends Base {
    @OneToOne(() => UserMatch, (userMatch: UserMatch) => userMatch.match)
    userMatch: Relation<UserMatch>;

    @Column({ type: "date" })
    finishedAt: Date;

    @OneToOne(() => UserMatch, { onDelete: "SET NULL", nullable: true })
    winner: Relation<UserMatch>;
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
    channel: Relation<Channel>;

    @ManyToOne(() => User, (user: User) => user.userChannels, {
        onDelete: "CASCADE",
    })
    user: Relation<User>;

    @OneToOne(() => UserChannel)
    mutedBy: UserChannel;
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

@Entity()
export class Avatar extends Base {
    @Column({ unique: true })
    path: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user: Relation<User>;

    @Column({ default: false })
    activate: boolean;

    constructor(path: string, activate?: boolean) {
        super();
        this.path = path;
        this.activate = activate ? activate : false;
    }
}

@Entity()
export class UserStats extends Base {
    @Column({ default: 0 })
    @Min(0)
    level: number;

    @Column({ default: 0 })
    @Min(0)
    victories: number;

    @Column({ default: 0 })
    @Min(0)
    defeats: number;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    user: Relation<User>;
}

@Entity()
export class User extends Base {
    @PrimaryColumn()
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

    @OneToOne(() => UserStats, (stats: UserStats) => stats.user, {
        onDelete: "RESTRICT",
        eager: true,
        cascade: true,
    })
    @JoinColumn({ name: "userStatsId", referencedColumnName: "id" })
    stats: UserStats;

    @OneToMany(() => Avatar, (avatar: Avatar) => avatar.user, {
        cascade: true,
        eager: true,
    })
    avatars: Avatar[];

    constructor(login: string) {
        super();

        this.login = login;
        this.userName = login;
        this.stats = new UserStats();
    }
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

    @Column({ default: 0 })
    @Min(0)
    score: number;

    @Column()
    role: UserMatchRole;
}
