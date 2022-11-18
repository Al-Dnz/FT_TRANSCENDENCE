import { Type } from 'class-transformer';
import {IsNotEmpty, IsInt, IsString, Min, Length, IsOptional, IsEnum, NotContains } from 'class-validator';

import { ChannelType } from 'db-interface/Core';

export class CreateChannelDto
{
	@IsString()
	@Length(1)
	name: string;

	@IsOptional()
	@IsString()
	@Length(1)
	@NotContains(" ", { message: "No spaces allowed" } )
	password: string;

	@IsOptional()
	@IsEnum(ChannelType)
	type: ChannelType;

}
