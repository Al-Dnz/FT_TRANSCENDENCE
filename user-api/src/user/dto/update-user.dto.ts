import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean } from 'validation/helper';

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  two_fa?: boolean;
}
