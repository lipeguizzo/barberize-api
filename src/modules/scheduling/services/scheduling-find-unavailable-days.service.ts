import { $Enums } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SchedulingFindUnavailableDaysDto } from '../domain/dto/scheduling-find-unavailable-days.dto';
import { formatDate } from 'src/shared/utils/date';
import { SchedulingFindUnavailableDaysResponseDto } from '../domain/dto/scheduling-find-unavailable-days-response.dto';

@Injectable()
export class SchedulingFindUnavailableDaysService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: SchedulingFindUnavailableDaysDto,
  ): Promise<SchedulingFindUnavailableDaysResponseDto[]> {
    const schedulings = await this.prisma.scheduling.findMany({
      where: {
        companyId: dto.companyId,
        barberId: dto.barberId,
      },
    });

    const unavailableDays: string[] = [
      ...new Set(schedulings.map((scheduling) => formatDate(scheduling.date))),
    ];

    const allHours = await this.prisma.horary.findMany({
      where: {
        companyId: dto.companyId,
      },
    });

    const fullyBookedDays: SchedulingFindUnavailableDaysResponseDto[] = [];

    for (const day of unavailableDays) {
      const targetDate = new Date(day);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const schedulingsForDay = await this.prisma.scheduling.findMany({
        where: {
          companyId: dto.companyId,
          barberId: dto.barberId,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
          status: {
            in: [
              $Enums.SchedulingStatus.WAITING,
              $Enums.SchedulingStatus.CONFIRMED,
            ],
          },
        },
      });

      if (schedulingsForDay.length >= allHours.length) {
        fullyBookedDays.push({ date: day });
      }
    }

    return fullyBookedDays;
  }
}
