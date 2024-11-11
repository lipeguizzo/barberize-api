import { IsBoolean } from 'class-validator';

export class HoraryUpdateAvailableDto {
  @IsBoolean({ message: 'Disponível inválido!' })
  isAvailable: boolean;
}
