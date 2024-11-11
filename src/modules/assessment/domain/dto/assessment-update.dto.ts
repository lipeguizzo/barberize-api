import { PartialType } from '@nestjs/swagger';
import { AssessmentCreateDto } from './assessment-create.dto';

export class AssessmentUpdateDto extends PartialType(AssessmentCreateDto) {}
