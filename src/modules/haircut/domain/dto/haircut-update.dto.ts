import { PartialType } from '@nestjs/swagger';
import { HaircutCreateDto } from './haircut-create.dto';

export class HaircutUpdateDto extends PartialType(HaircutCreateDto) {}
