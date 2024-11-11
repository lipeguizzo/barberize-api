import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class HoraryFindManyDto extends PaginationRequestDto {
  @IsString({ message: 'Pesquisa inválida!' })
  @IsOptional()
  search?: string;

  @IsString({ message: 'Horário inválida!' })
  @IsOptional()
  time?: string;

  @IsBoolean({ message: 'Disponível inválido!' })
  @IsDefined()
  @Transform(({ value }) => value == 'true')
  isAvailable?: boolean = false;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  companyId?: number;
}
