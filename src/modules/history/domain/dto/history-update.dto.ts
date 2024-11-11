import { PartialType } from '@nestjs/swagger';
import { HistoryCreateDto } from './history-create.dto';

export class HistoryUpdateDto extends PartialType(HistoryCreateDto) {}
