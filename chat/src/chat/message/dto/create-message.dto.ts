import {IsNotEmpty, IsInt, IsString, IsOptional, Min, Length, IsBoolean } from 'class-validator';

export class CreateMessageDto
{
	@IsString()
	@IsNotEmpty()
	text: string;

	// @IsBoolean()
	// @IsOptional()
	// private: boolean;

	// @IsString()
	// @IsNotEmpty()
	// token: string;

	@IsInt()
  	@Min(1)
	@IsOptional()
	channelId: number;

	//to remove
	// @IsInt()
  	// @Min(1)
	// @IsOptional()
	// senderId: number;
}
