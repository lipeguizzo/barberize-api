import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class RoleUpdateStatusDto {
  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;
}
