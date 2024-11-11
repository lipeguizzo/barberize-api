import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HistoryEntity } from '../domain/entities/history.entity';

@Injectable()
export class HistoryFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number): Promise<HistoryEntity> {
    const history = await this.prisma.history.findFirst({
      where: {
        id: id,
      },
      include: {
        scheduling: true,
      },
    });

    if (!history) throw new NotFoundException('Histórico não encontrado!');

    return new HistoryEntity(history);
  }
}
