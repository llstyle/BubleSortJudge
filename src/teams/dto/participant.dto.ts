import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParticipantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  participant: string;
}
