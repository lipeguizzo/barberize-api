import { $Enums } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';

export class WorkingDayCreateDto {
  @IsEnum($Enums.DayOfWeek, { message: 'Dia inválido!' })
  day: $Enums.DayOfWeek;

  @IsBoolean({ message: 'Aberto inválido!' })
  isOpen: boolean;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;
}
