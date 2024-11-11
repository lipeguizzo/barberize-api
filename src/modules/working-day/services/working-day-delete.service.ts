import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class WorkingDayDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<void> {
    const workingDay = await this.prisma.workingDay.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!workingDay) throw new NotFoundException('Dia não encontrado!');

    await this.prisma.workingDay.delete({
      where: {
        id: id,
      },
    });
  }
}
