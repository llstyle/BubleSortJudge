import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateProblemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  draft: boolean = true;
  @ApiProperty()
  @IsEnum(Rating)
  rating: Rating;
}
