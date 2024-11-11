import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SchedulingFindUnavailableDaysDto {
  @IsNumber({}, { message: 'Barbeiro inválido!' })
  @Transform(({ value }) => Number(value))
  barberId: number;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @Transform(({ value }) => Number(value))
  companyId: number;
}
