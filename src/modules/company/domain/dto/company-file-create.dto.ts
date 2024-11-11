import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined } from 'class-validator';

export class CompanyFileCreateDto {
  @IsBoolean({ message: 'Valor público inválido!' })
  @IsDefined()
  @Transform(({ value }) => value == 'true')
  isPublic?: boolean = true;
}
