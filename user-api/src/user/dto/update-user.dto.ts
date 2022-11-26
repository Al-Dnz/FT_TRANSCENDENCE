import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MapID, PaddleID } from 'db-interface/Core';

export class UpdateSettingsDto {
    @IsBoolean()
    two_fa: boolean;

    @IsEnum(PaddleID)
    paddle_id: PaddleID;

    @IsEnum(MapID)
    map_id: MapID;
}

export class UpdateUserDto {
    @IsOptional()
    username?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateSettingsDto)
    settings?: UpdateSettingsDto;
}
