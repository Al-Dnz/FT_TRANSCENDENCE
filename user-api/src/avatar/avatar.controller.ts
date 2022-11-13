import { AvatarService } from './avatar.service';
import {
    Controller,
    UseGuards,
    UseInterceptors,
    Get,
    Delete,
    NotFoundException,
    InternalServerErrorException,
    HttpCode,
    Query,
    Param,
    UploadedFile,
    BadRequestException,
    Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggingInterceptor } from 'src/auth/auth.interceptor';
import { UserService } from 'user-api/user.service';
import { Identity } from 'user-api/user.decorator';
import { AvatarOutputDto } from './dto/avatar-output.dto';
import { QueryFilterDto } from 'validation/query.dto';
import { User, Avatar } from 'db-interface/Core';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users/me/avatars')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class AvatarController {
    constructor(
        private readonly avatarService: AvatarService,
        private readonly userService: UserService,
    ) { }

    @Get()
    async listUserAvatars(
        @Identity() user: Identity,
        @Query() query: QueryFilterDto,
    ): Promise<AvatarOutputDto[]> {
        const userFound: User | undefined = await this.userService.findOne(
            user.login,
        );
        if (!userFound) {
            throw new NotFoundException(`user ${user.login} not found`);
        }

        return this.avatarService
            .list(user.login, query)
            .then((avatars: Avatar[]) =>
                avatars.map((avatar: Avatar) => new AvatarOutputDto(avatar)),
            )
            .catch((error: Error) => {
                throw new InternalServerErrorException(error.message);
            });
    }

    @Delete(':avatar_id')
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

        const avatars: Avatar[] = await this.avatarService.list(
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

        this.avatarService.deleteByID(user.login, id).catch((error: Error) => {
            throw new InternalServerErrorException(error.message);
        });
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({ destination: '/app/upload' }),
        }),
    )
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Identity() user: Identity,
    ) {
        switch (file.mimetype) {
            case 'image/png':
            case 'image/jpg':
                const userFound: User | undefined = await this.userService.findOne(
                    user.login,
                );
                if (!userFound) {
                    throw new NotFoundException(`user ${user.login} not found`);
                }
                return this.avatarService
                    .create(userFound, file.filename)
                    .then((value: Avatar) => new AvatarOutputDto(value))
                    .catch((error: Error) => {
                        throw new InternalServerErrorException(error.message);
                    });
            default:
                throw new BadRequestException(
                    `invalid file type ${file.mimetype}. File type shoud be png or jpg`,
                );
        }
    }
}
