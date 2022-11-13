import { Module } from '@nestjs/common';
import { UserModule } from 'user-api/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    User,
    UserMatch,
    Match,
    Channel,
    UserChannel,
    UserStats,
    Message,
    Avatar,
} from 'db-interface/Core';
import { AvatarModule } from './avatar/avatar.module';

@Module({
    imports: [
        UserModule,
        AvatarModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [
                Avatar,
                Match,
                UserMatch,
                Channel,
                UserChannel,
                Message,
                UserStats,
                User,
            ],
            synchronize: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
