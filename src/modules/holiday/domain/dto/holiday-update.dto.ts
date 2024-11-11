import { PartialType } from '@nestjs/swagger';
import { HolidayCreateDto } from './holiday-create.dto';

export class HolidayUpdateDto extends PartialType(HolidayCreateDto) {}
