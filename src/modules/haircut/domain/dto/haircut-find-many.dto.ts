import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class HaircutFindManyDto extends PaginationRequestDto {
  @IsString({ message: 'Pesquisa inválida!' })
  @IsOptional()
  search?: string;

  @IsString({ message: 'Nome inválido!' })
  @IsOptional()
  name?: string;

  @IsBoolean({ message: 'Incluir deletados inválido!' })
  @IsDefined()
  @Transform(({ value }) => value == 'true')
  includeDeleted?: boolean = false;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  companyId?: number;
}
