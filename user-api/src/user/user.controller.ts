import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserInput, UpdateUserInput, UserOutput } from './user.dto';

@Controller('api/users')
export class UserController {
  @Get()
  ListUsers(): Observable<UserOutput[]> {}

  @Post()
  CreateOneUser(@Body() body: CreateUserInput): Observable<UserOutput> {}

  @Get('me')
  GetUserMe(): Observable<UserOutput> {}

  @Patch('me')
  PartialUserMeUpdate(@Body() body: UpdateUserInput): Observable<UserOutput> {}

  @Delete('me')
  DeleteUserMe() {}

  @Get(':user_id')
  GetUserByID(@Param('user_id') user_id: string): Observable<UserOutput> {}
}
