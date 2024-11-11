import { IsBoolean } from 'class-validator';

export class WorkingDayUpdateOpenDto {
  @IsBoolean({ message: 'Aberto inválido!' })
  isOpen: boolean;
}
