
import {IsNotEmpty, IsInt, IsString, Min, Length, IsOptional, IsEnum, NotContains } from 'class-validator';

export class DirectMessageDto
{
	@IsInt()
	@Min(1)
	userId: number

}
