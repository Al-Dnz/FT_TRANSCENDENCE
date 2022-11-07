import {IsNotEmpty, IsInt, Min, Length } from 'class-validator';

export class CreateMessageDto
{
	@IsNotEmpty()
	@Length(3)
	text: string;

	@IsInt()
  	@Min(1)
	senderId: number;

	@IsInt()
  	@Min(1)
	channelId: number;
}
