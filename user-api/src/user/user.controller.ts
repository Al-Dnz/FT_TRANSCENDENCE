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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFilterDto } from 'validation/query.dto';
import { User } from 'db-interface/Core';
import { UserOutputDto } from 'user-api/dto/user-output.dto';
import { Identity } from './user.decorator';
import { DeleteResult } from 'typeorm';
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
            .findAll(query)
            .then((users: User[]) =>
                users.map((value: User) => new UserOutputDto(value)),
            );
    }

    @Post()
    async create(
        @Body() createUserDto: CreateUserDto,
        @Identity() user: Identity,
    ): Promise<UserOutputDto> {
        return new UserOutputDto(
            await this.userService.create(createUserDto, user.image_url),
        );
    }

    @Get('me')
    async userMe(@Identity() user: Identity): Promise<UserOutputDto> {
        return this.userService
            .findOne(user.login)
            .then((value: User) => new UserOutputDto(value));
    }

    @Patch('me')
    async update(
        @Body() updateUserDto: UpdateUserDto,
        @Identity() user: Identity,
    ): Promise<UserOutputDto> {
        return this.userService
            .updateByLogin(user.login, updateUserDto)
            .then(() =>
                this.userService
                    .findOne(user.login)
                    .then((value: User) => new UserOutputDto(value)),
            );
    }

    @Delete('me')
    @HttpCode(204)
    async remove(@Identity() user: Identity) {
        return this.userService
            .removeByLogin(user.login)
            .then((value: DeleteResult) => {
                if (value.affected != 1) {
                    throw new NotFoundException(`user ${user.login} not found`);
                }
            });
    }

    @Get(':login')
    async findOne(@Param('login') login: string): Promise<UserOutputDto> {
        return this.userService
            .findOne(login)
            .then((value: User) => new UserOutputDto(value));
    }

    @Get('me/friends')
    async findFriends(
        @Identity() user: Identity,
        @Query() query: QueryFilterDto,
    ): Promise<UserOutputDto[]> {
        return this.userService
            .findFriends(user.login, query)
            .then((value: User[]) =>
                value.map((user: User) => new UserOutputDto(user)),
            );
    }

    @Put('me/friends/:login')
    @HttpCode(204)
    async addMeFriends(
        @Identity() user: Identity,
        @Param('login') login: string,
    ): Promise<void> {
        this.userService.addFriends(user.login, login);
    }

    @Delete('me/friends/:login')
    @HttpCode(204)
    async removeMeFriends(
        @Identity() user: Identity,
        @Param('login') login: string,
    ): Promise<void> {
        this.userService.removeFriends(user.login, login);
    }
}
