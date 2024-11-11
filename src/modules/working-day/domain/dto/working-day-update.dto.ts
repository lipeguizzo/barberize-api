import { PartialType } from '@nestjs/swagger';
import { WorkingDayCreateDto } from './working-day-create.dto';

export class WorkingDayUpdateDto extends PartialType(WorkingDayCreateDto) {}
