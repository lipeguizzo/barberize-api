import { PartialType } from '@nestjs/swagger';
import { SchedulingCreateDto } from './scheduling-create.dto';

export class SchedulingUpdateDto extends PartialType(SchedulingCreateDto) {}
