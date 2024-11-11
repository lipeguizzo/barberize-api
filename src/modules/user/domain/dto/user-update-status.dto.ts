import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UserUpdateStatusDto {
  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;
}
