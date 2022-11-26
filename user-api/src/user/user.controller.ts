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
    UseGuards,
    UseInterceptors,
    InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'user-api/dto/update-user.dto';
import { QueryFilterDto } from 'validation/query.dto';
import { User } from 'db-interface/Core';
import { UserOutputDto } from 'user-api/dto/user-output.dto';
import { Identity } from './user.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggingInterceptor } from 'src/auth/auth.interceptor';

@Controller('api/users')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(@Query() query: QueryFilterDto): Promise<UserOutputDto[]> {
        return this.userService
            .list(query)
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
        const found: User | undefined = await this.userService.findOne(user.login);

        if (!found) {
            throw new NotFoundException(`user ${user.login} not found`);
        }

        return this.userService
            .updateOne(found, updateUserDto)
            .then((value: User) => new UserOutputDto(value));
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
}
