import { PartialType } from '@nestjs/swagger';
import { CompanyFileCreateDto } from './company-file-create.dto';

export class CompanyFileUpdateDto extends PartialType(CompanyFileCreateDto) {}
