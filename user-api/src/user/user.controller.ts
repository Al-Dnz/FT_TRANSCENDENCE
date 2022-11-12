import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Put,
    Param,
    Delete,
    Query,
    HttpCode,
    NotFoundException,
    BadRequestException,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFilterDto } from 'validation/query.dto';
import { User, Avatar, Match } from 'db-interface/Core';
import {
    ActualAvatarOutputDto,
    UserOutputDto,
    AvatarOutputDto,
} from 'user-api/dto/user-output.dto';
import { Identity } from './user.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggingInterceptor } from 'src/auth/auth.interceptor';
import { MatchOutputDto } from './dto/match-output';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(@Query() query: QueryFilterDto): Promise<UserOutputDto[]> {
        return this.userService
            .findAll(query)
            .then((users: User[]) =>
                users.map((value: User) => new UserOutputDto(value)),
            )
            .catch((error: Error) => {
                throw new InternalServerErrorException(error.message);
            });
    }

    @Post()
    async create(@Identity() user: Identity): Promise<UserOutputDto> {
        const found: User | undefined = await this.userService.findOne(user.login);
        if (!found) {
            return this.userService
                .create(user.login, user.image_url)
                .then((value: User) => {
                    return new UserOutputDto(value);
                })
                .catch((error: Error) => {
                    throw new InternalServerErrorException(error.message);
                });
        }
        return new UserOutputDto(found);
    }

    @Get('me')
    async userMe(@Identity() user: Identity): Promise<UserOutputDto> {
        const found: User | undefined = await this.userService.findOne(user.login);
        if (!found) {
            throw new NotFoundException(`user ${user.login} not found`);
        }
        return new UserOutputDto(found);
    }

    @Patch('me')
    async update(
        @Body() updateUserDto: UpdateUserDto,
        @Identity() user: Identity,
    ): Promise<UserOutputDto> {
        const result: UpdateResult = await this.userService.updateByLogin(
            user.login,
            updateUserDto,
        );
        if (result.affected && result.affected > 0) {
            return this.userService
                .findOne(user.login)
                .then((user: User) => new UserOutputDto(user))
                .catch((error: Error) => {
                    throw new InternalServerErrorException(error.message);
                });
        }
        throw new NotFoundException(`user ${user.login} not found`);
    }

    @Delete('me')
    @HttpCode(204)
    async remove(@Identity() user: Identity): Promise<void> {
        const result: DeleteResult = await this.userService.removeByLogin(
            user.login,
        );
        if (!result.affected || (result.affected && result.affected == 0)) {
            throw new NotFoundException(`user ${user.login} not found`);
        }
    }

    @Get(':login')
    async findOne(@Param('login') login: string): Promise<UserOutputDto> {
        const user: User | undefined = await this.userService.findOne(login);
        if (user) {
            return new UserOutputDto(user);
        }
        throw new NotFoundException(`user ${login} not found`);
    }

    @Get('me/friends')
    async findFriends(
        @Identity() user: Identity,
        @Query() query: QueryFilterDto,
    ): Promise<UserOutputDto[]> {
        const users: User[] = await this.userService.findFriends(user.login, query);
        return users.map((user: User) => new UserOutputDto(user));
    }

    @Put('me/friends/:login')
    @HttpCode(204)
    async addMeFriends(
        @Identity() user: Identity,
        @Param('login') login: string,
    ): Promise<void> {
        const userOne: User | undefined = await this.userService.findOne(
            user.login,
        );
        const userTwo: User | undefined = await this.userService.findOne(login);

        if (!userOne) {
            throw new NotFoundException(`user ${user.login} not found`);
        }
        if (!userTwo) {
            throw new NotFoundException(`user ${login} not found`);
        }

        this.userService.addFriends(user.login, login).catch((error: Error) => {
            throw new InternalServerErrorException(error.message);
        });
    }

    @Delete('me/friends/:login')
    @HttpCode(204)
    async removeMeFriends(
        @Identity() user: Identity,
        @Param('login') login: string,
    ): Promise<void> {
        const userOne: User | undefined = await this.userService.findOne(
            user.login,
        );
        const userTwo: User | undefined = await this.userService.findOne(login);

        if (!userOne) {
            throw new NotFoundException(`user ${user.login} not found`);
        }
        if (!userTwo) {
            throw new NotFoundException(`user ${login} not found`);
        }
        this.userService.removeFriends(user.login, login).catch((error: Error) => {
            throw new InternalServerErrorException(error.message);
        });
    }

    @Get('me/avatars')
    async listUserAvatars(
        @Identity() user: Identity,
        @Query() query: QueryFilterDto,
    ): Promise<ActualAvatarOutputDto[]> {
        const userFound: User | undefined = await this.userService.findOne(
            user.login,
        );
        if (!userFound) {
            throw new NotFoundException(`user ${user.login} not found`);
        }

        return this.userService
            .listAvatars(user.login, query)
            .then((avatars: Avatar[]) =>
                avatars.map((avatar: Avatar) => new AvatarOutputDto(avatar)),
            )
            .catch((error: Error) => {
                throw new InternalServerErrorException(error.message);
            });
    }

    @Delete('me/avatars/:avatar_id')
    @HttpCode(204)
    async deleteUserAvatar(
        @Identity() user: Identity,
        @Param('avatar_id') id: number,
    ): Promise<void> {
        const userFound: User | undefined = await this.userService.findOne(
            user.login,
        );
        if (!userFound) {
            throw new NotFoundException(`user ${user.login} not found`);
        }

        const avatars: Avatar[] = await this.userService.listAvatars(
            user.login,
            new QueryFilterDto(),
        );
        if (avatars.length == 0) {
            throw new InternalServerErrorException(
                `no avatars for user ${user.login}`,
            );
        }
        if (avatars.length == 1) {
            throw new BadRequestException('cannot delete the default avatar');
        }

        const avatarFound: Avatar | undefined = avatars.find(
            (value: Avatar): boolean => value.id == id,
        );
        if (!avatarFound) {
            throw new NotFoundException(`avatar ${id} not found`);
        }

        this.userService.deleteAvatarByID(user.login, id).catch((error: Error) => {
            throw new InternalServerErrorException(error.message);
        });
    }

    @Get('me/match_history')
    async listUserMatchHistory(
        @Identity() user: Identity,
        @Query() query: QueryFilterDto,
    ): Promise<MatchOutputDto[]> {
        const userFound: User | undefined = await this.userService.findOne(
            user.login,
        );
        if (!userFound) {
            throw new NotFoundException(`user ${user.login} not found`);
        }
        return this.userService
            .listMatchByUserID(user.login, query)
            .then((matchs: Match[]) => {
                return matchs.map((match: Match) => new MatchOutputDto(match));
            })
            .catch((error: Error) => {
                throw new InternalServerErrorException(error.message);
            });
    }

    @Post('me/avatars')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
