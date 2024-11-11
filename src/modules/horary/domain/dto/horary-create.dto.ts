import { IsBoolean, IsNumber } from 'class-validator';
import { IsTime } from 'src/shared/decorators/is-time.decorator';

export class HoraryCreateDto {
  @IsTime()
  time: string;

  @IsBoolean({ message: 'Disponível inválido!' })
  isAvailable: boolean;

  @IsNumber({}, { message: 'Empresa inválida!' })
  companyId: number;
}
