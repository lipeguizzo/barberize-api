import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class WorkingDayFindManyDto extends PaginationRequestDto {
  @IsEnum($Enums.DayOfWeek, { message: 'Dia inválido!' })
  @IsOptional()
  day?: $Enums.DayOfWeek;

  @IsBoolean({ message: 'Aberto inválido!' })
  @IsDefined()
  @Transform(({ value }) => value == 'true')
  isOpen?: boolean = false;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  companyId?: number;
}
