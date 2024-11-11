import { IsNumber, IsString } from 'class-validator';

export class HaircutCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name: string;

  @IsNumber({}, { message: 'Preço inválido!' })
  price: number;

  @IsNumber({}, { message: 'Duração inválida!' })
  duration: number;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;
}
