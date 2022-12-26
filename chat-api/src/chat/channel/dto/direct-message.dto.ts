
import {IsNotEmpty, IsInt, IsString, Min, Length, IsOptional, IsEnum, NotContains } from 'class-validator';

export class DirectMessageDto
{
	@IsString()
	@Length(1)
	login: string
}
