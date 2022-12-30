
import {IsNotEmpty, IsInt, IsString, Min, Length, IsOptional, IsEnum, NotContains } from 'class-validator';
import { UserChannelRole } from 'db-interface/Core';


export class InviteUserDto
{
	@IsInt()
	@Min(1)
	userId: number

	@IsInt()
	@Min(1)
	channelId: number

}
