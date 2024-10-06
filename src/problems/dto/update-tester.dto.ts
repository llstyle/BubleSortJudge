import { PartialType } from '@nestjs/swagger';
import { AddTesterDto } from './add-tester.dto';

export class UpdateTesterDto extends PartialType(AddTesterDto) {}
