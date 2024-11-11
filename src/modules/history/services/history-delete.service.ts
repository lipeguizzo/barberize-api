import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class HistoryDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number): Promise<void> {
    const history = await this.prisma.history.findFirst({
      where: {
        id: id,
      },
    });

    if (!history) throw new NotFoundException('Histórico não encontrado!');

    await this.prisma.history.delete({
      where: {
        id: id,
      },
    });
  }
}
