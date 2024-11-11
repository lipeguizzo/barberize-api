import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { companyExistingValidator } from 'src/modules/company/validators/company-existing.validator';
import { horaryExistingValidator } from 'src/modules/horary/validators/horary-existing.validator';
import { barberExistingValidator } from 'src/modules/user/validators/barber-existing.validator';
import { clientExistingValidator } from 'src/modules/user/validators/client-existing.validator';
import { SchedulingCreateDto } from '../domain/dto/scheduling-create.dto';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import { schedulingDateValidator } from '../validators/scheduling-date.validator';
import { schedulingExistingValidator } from '../validators/scheduling-existing.validator';
import { haircutExistingValidator } from 'src/modules/haircut/validators/haircut-existing.validator';

@Injectable()
export class SchedulingCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(dto: SchedulingCreateDto): Promise<SchedulingEntity> {
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

    const createdScheduling = await this.prisma.scheduling.create({
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
      include: {
        company: true,
        horary: true,
        haircut: true,
        client: true,
        barber: true,
      },
    });

    return new SchedulingEntity(createdScheduling);
  }
}
