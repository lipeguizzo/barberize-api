import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class SchedulingFindManyDto extends PaginationRequestDto {
  @IsString({ message: 'Pesquisa inválida!' })
  @IsOptional()
  search?: string;

  @IsString({ message: 'Data inválida!' })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'A data deve estar no formato YYYY-MM-DD!',
  })
  @IsOptional()
  date?: string;

  @IsNumber({}, { message: 'Cliente inválido!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  clientId?: number;

  @IsString({ message: 'Nome de cliente inválido!' })
  @IsOptional()
  clientName?: string;

  @IsNumber({}, { message: 'Barbeiro inválido!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  barberId?: number;

  @IsString({ message: 'Nome de barbeiro inválido!' })
  @IsOptional()
  barberName?: string;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  companyId?: number;

  @IsArray()
  @IsEnum($Enums.SchedulingStatus, { message: 'Status inválido!', each: true })
  @IsOptional()
  status?: $Enums.SchedulingStatus[];
}
