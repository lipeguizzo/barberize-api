import { IsNumber, IsString } from 'class-validator';

export class HistoryCreateDto {
  @IsString({ message: 'Ação inválida!' })
  action: string;

  @IsNumber({}, { message: 'Agendamento inválido!' })
  schedulingId: number;
}
