import { Transform } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';
import { Sort } from '../../types/sort';

export class PaginationRequestDto {
  @IsNumber({}, { message: 'Página inválida!' })
  @Transform(({ value }) => Number(value))
  @IsDefined()
  page: number = 1;

  @IsNumber({}, { message: 'Itens por página inválido!' })
  @Transform(({ value }) => Number(value))
  @IsDefined()
  pageSize: number = 10;

  ordering?: Sort = 'asc';

  orderBy?: string;
}
