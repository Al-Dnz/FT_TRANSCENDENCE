import {IsNotEmpty, IsInt, IsString, Min, Length } from 'class-validator';

export class CreateChannelDto
{
	@IsString()
	@IsNotEmpty()
	name: string;
}
