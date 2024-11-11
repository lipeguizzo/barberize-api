import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkingDayEntity } from '../domain/entities/working-day.entity';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class WorkingDayFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    const workingDay = await this.prisma.workingDay.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
      include: { company: true },
    });

    if (!workingDay) throw new NotFoundException('Dia não encontrado!');

    return new WorkingDayEntity(workingDay);
  }
}
