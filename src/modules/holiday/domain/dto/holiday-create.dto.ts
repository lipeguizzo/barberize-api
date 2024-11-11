import { IsNumber, IsString } from 'class-validator';
import { IsDayMonth } from 'src/shared/decorators/is-day-month.decorator';

export class HolidayCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name: string;

  @IsDayMonth()
  dayMonth: string;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;
}
