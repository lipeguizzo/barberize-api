import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkingDayUpdateOpenDto } from '../domain/dto/working-day-update-open.dto';
import { WorkingDayEntity } from '../domain/entities/working-day.entity';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class WorkingDayUpdateOpenService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: WorkingDayUpdateOpenDto,
    userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    const workingDay = await this.prisma.workingDay.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!workingDay) throw new NotFoundException('Dia não encontrado!');

    const updatedWorkingDay = await this.prisma.workingDay.update({
      data: {
        isOpen: dto.isOpen,
      },
      where: {
        id: id,
      },
    });

    return new WorkingDayEntity(updatedWorkingDay);
  }
}
