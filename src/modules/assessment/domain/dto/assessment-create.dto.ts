import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssessmentCreateDto {
  @IsNumber({}, { message: 'Avaliação inválida!' })
  score: number;

  @IsString({ message: 'Avaliação inválida!' })
  @IsOptional()
  commentary: string;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;

  @IsNumber({}, { message: 'Cliente inválido!' })
  clientId: number;

  @IsNumber({}, { message: 'Barbeiro inválido!' })
  barberId: number;
}
