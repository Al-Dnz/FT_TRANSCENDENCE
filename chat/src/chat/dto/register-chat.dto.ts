
import {IsNotEmpty, IsInt, IsString, Min, Length, IsOptional, IsEnum, NotContains } from 'class-validator';

export class RegisterChatDto
{
	@IsString()
	@Length(1)
	token: string
}
