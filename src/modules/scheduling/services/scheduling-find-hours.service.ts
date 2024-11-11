import { $Enums } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HoraryEntity } from 'src/modules/horary/domain/entities/horary.entity';
import { SchedulingFindHoursDto } from '../domain/dto/scheduling-find-hours.dto';

@Injectable()
export class SchedulingFindHoursService {
  constructor(private prisma: PrismaService) {}
  async execute(dto: SchedulingFindHoursDto): Promise<HoraryEntity[]> {
    const targetDate = new Date(dto.date);

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const schedulings = await this.prisma.scheduling.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        companyId: dto.companyId ?? undefined,
        barberId: dto.barberId ?? undefined,
        status: {
          in: [
            $Enums.SchedulingStatus.WAITING,
            $Enums.SchedulingStatus.CONFIRMED,
          ],
        },
      },
      include: {
        horary: true,
      },
    });

    const hours = await this.prisma.horary.findMany({
      where: {
        companyId: dto.companyId ?? undefined,
        isAvailable: true,
      },
    });

    const unavailableHours = schedulings.map(
      (scheduling) => scheduling.horaryId,
    );

    const availableHours = hours.filter(
      (horary) => !unavailableHours.includes(horary.id),
    );

    return availableHours.map((horary) => new HoraryEntity(horary));
  }
}
