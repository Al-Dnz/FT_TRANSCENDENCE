import {IsNotEmpty, IsInt, Min, Length } from 'class-validator';

export class CreateChannelDto
{
	@IsNotEmpty()
	name: string;
}
