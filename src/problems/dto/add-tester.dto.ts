import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddTesterDto {
  @ApiProperty()
  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
