import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class SchedulingFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
      include: {
        company: true,
        horary: true,
        haircut: true,
        client: true,
        barber: true,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    return new SchedulingEntity(scheduling);
  }
}
