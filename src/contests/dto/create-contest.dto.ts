import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  MinDate,
} from 'class-validator';

export class CreateContestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  problems: string[];
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  timeEnd: Date;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teamId: string;
}
