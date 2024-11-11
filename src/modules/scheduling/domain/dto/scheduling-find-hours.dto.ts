import { Transform } from 'class-transformer';
import { IsNumber, IsString, Matches } from 'class-validator';

export class SchedulingFindHoursDto {
  @IsString({ message: 'Data inválida!' })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'A data deve estar no formato YYYY-MM-DD!',
  })
  date: string;

  @IsNumber({}, { message: 'Barbeiro inválido!' })
  @Transform(({ value }) => Number(value))
  barberId: number;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @Transform(({ value }) => Number(value))
  companyId: number;
}
