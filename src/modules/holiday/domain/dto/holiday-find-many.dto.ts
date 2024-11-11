import { IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/shared/domain/dto/pagination-request.dto';

export class HolidayFindManyDto extends PaginationRequestDto {
  @IsString({ message: 'Pesquisa inválida!' })
  @IsOptional()
  search?: string;

  @IsString({ message: 'Nome inválido!' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Feriado inválida!' })
  @IsOptional()
  dayMonth?: string;
}
