import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
  @ApiProperty()
  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}
