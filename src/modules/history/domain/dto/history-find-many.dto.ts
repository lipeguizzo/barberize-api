import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class HistoryFindManyDto extends PaginationRequestDto {
  @IsString({ message: 'Pesquisa inválida!' })
  @IsOptional()
  search?: string;

  @IsNumber({}, { message: 'Cliente inválido!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  clientId?: number;

  @IsString({ message: 'Nome de cliente inválido!' })
  @IsOptional()
  clientName?: string;

  @IsString({ message: 'Nome de barbeiro inválido!' })
  @IsOptional()
  barberName?: string;

  @IsNumber({}, { message: 'Barbeiro inválido!' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  barberId?: number;
}
