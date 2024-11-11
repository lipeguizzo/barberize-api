import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { schedulingDeleteValidator } from '../validators/scheduling-delete.validator';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class SchedulingDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<void> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    await schedulingDeleteValidator(id);

    await this.prisma.scheduling.delete({
      where: {
        id: id,
      },
    });
  }
}
