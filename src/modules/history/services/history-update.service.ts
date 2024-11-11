import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HistoryUpdateDto } from '../domain/dto/history-update.dto';
import { HistoryEntity } from '../domain/entities/history.entity';

@Injectable()
export class HistoryUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, dto: HistoryUpdateDto): Promise<HistoryEntity> {
    const history = await this.prisma.history.findFirst({
      where: {
        id: id,
      },
    });

    if (!history) throw new NotFoundException('Histórico não encontrado!');

    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: dto.schedulingId,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    const updatedHistory = await this.prisma.history.update({
      data: {
        action: dto.action,
        scheduling: {
          connect: {
            id: dto.schedulingId,
          },
        },
      },
      where: {
        id: id,
      },
      include: {
        scheduling: true,
      },
    });

    return new HistoryEntity(updatedHistory);
  }
}
