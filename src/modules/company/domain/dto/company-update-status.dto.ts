import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CompanyUpdateStatusDto {
  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;
}
