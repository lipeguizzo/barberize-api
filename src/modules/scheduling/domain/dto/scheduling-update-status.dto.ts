import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class SchedulingUpdateStatusDto {
  @IsEnum($Enums.SchedulingStatus, { message: 'Status inválido!' })
  status: $Enums.SchedulingStatus;
}
