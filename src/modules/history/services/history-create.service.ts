import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HistoryCreateDto } from '../domain/dto/history-create.dto';
import { HistoryEntity } from '../domain/entities/history.entity';

@Injectable()
export class HistoryCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(dto: HistoryCreateDto): Promise<HistoryEntity> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: dto.schedulingId,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    const createdHistory = await this.prisma.history.create({
      data: {
        action: dto.action,
        scheduling: {
          connect: {
            id: dto.schedulingId,
          },
        },
      },
      include: {
        scheduling: true,
      },
    });

    return new HistoryEntity(createdHistory);
  }
}
