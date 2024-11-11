import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class WorkingDayCreateDefaultService {
  constructor(private prisma: PrismaService) {}
  async execute(companyId: number): Promise<void> {
    await this.prisma.workingDay.createMany({
      data: [
        {
          day: $Enums.DayOfWeek.MONDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.TUESDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.WEDNESDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.THURSDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.FRIDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.SATURDAY,
          isOpen: true,
          companyId: companyId,
        },
        {
          day: $Enums.DayOfWeek.SUNDAY,
          isOpen: true,
          companyId: companyId,
        },
      ],
    });
  }
}
