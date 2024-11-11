import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber } from 'class-validator';

export class SchedulingCreateDto {
  @IsDate({
    message:
      'Data inválida, data deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)',
  })
  @Type(() => Date)
  date: Date;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;

  @IsNumber({}, { message: 'Horário inválido!' })
  horaryId: number;

  @IsNumber({}, { message: 'Corte inválido!' })
  haircutId: number;

  @IsNumber({}, { message: 'Cliente inválido!' })
  clientId: number;

  @IsNumber({}, { message: 'Barbeiro inválido!' })
  barberId: number;

  @IsEnum($Enums.SchedulingStatus, { message: 'Status inválido!' })
  status: $Enums.SchedulingStatus;
}
