import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { companyExistingValidator } from 'src/modules/company/validators/company-existing.validator';
import { horaryExistingValidator } from 'src/modules/horary/validators/horary-existing.validator';
import { barberExistingValidator } from 'src/modules/user/validators/barber-existing.validator';
import { clientExistingValidator } from 'src/modules/user/validators/client-existing.validator';
import { UserRequest } from 'src/shared/types/user-request';
import { SchedulingUpdateDto } from '../domain/dto/scheduling-update.dto';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import { schedulingDateValidator } from '../validators/scheduling-date.validator';
import { schedulingExistingValidator } from '../validators/scheduling-existing.validator';
import { haircutExistingValidator } from 'src/modules/haircut/validators/haircut-existing.validator';

@Injectable()
export class SchedulingUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: SchedulingUpdateDto,
    userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    await companyExistingValidator(dto.companyId);
    await clientExistingValidator(dto.clientId);
    await barberExistingValidator(dto.barberId, dto.companyId);
    await haircutExistingValidator(dto.horaryId, dto.companyId);
    await horaryExistingValidator(dto.horaryId, dto.companyId);
    await schedulingDateValidator(dto.date, dto.companyId);
    await schedulingExistingValidator(
      dto.date,
      dto.haircutId,
      dto.companyId,
      dto.barberId,
      dto.clientId,
    );

    const updatedScheduling = await this.prisma.scheduling.update({
      data: {
        date: dto.date,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
        horary: {
          connect: {
            id: dto.horaryId,
          },
        },
        haircut: {
          connect: {
            id: dto.haircutId,
          },
        },
        client: {
          connect: {
            id: dto.clientId,
          },
        },
        barber: {
          connect: {
            id: dto.barberId,
          },
        },
        status: dto.status,
      },
      where: {
        id: id,
      },
      include: {
        company: true,
        horary: true,
        haircut: true,
        client: true,
        barber: true,
      },
    });

    return new SchedulingEntity(updatedScheduling);
  }
}
