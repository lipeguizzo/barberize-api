import { PartialType } from '@nestjs/swagger';
import { HoraryCreateDto } from './horary-create.dto';

export class HoraryUpdateDto extends PartialType(HoraryCreateDto) {}
