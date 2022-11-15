import {IsNotEmpty, IsInt, IsString, IsOptional, Min, Length, IsBoolean } from 'class-validator';

export class CreateMessageDto
{
	@IsString()
	@IsNotEmpty()
	text: string;

	// @IsBoolean()
	// @IsOptional()
	// private: boolean;

	@IsInt()
  	@Min(1)
	@IsOptional()
	senderId: number;

	@IsInt()
  	@Min(1)
	@IsOptional()
	channelId: number;
}
