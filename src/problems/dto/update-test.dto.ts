import { PartialType } from '@nestjs/swagger';
import { AddTestDto } from './add-test.dto';

export class UpdateTestDto extends PartialType(AddTestDto) {}
