import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class HolidayCreateDefaultService {
  constructor(private prisma: PrismaService) {}
  async execute(companyId: number): Promise<void> {
    const defaultHolidays = [
      {
        name: 'Ano novo',
        dayMonth: '01-01',
      },
      {
        name: 'Tiradentes',
        dayMonth: '21-04',
      },
      {
        name: 'Independência do Brasil',
        dayMonth: '07-09',
      },
      {
        name: 'Nossa Senhora Aparecida',
        dayMonth: '12-10',
      },
      {
        name: 'Finados',
        dayMonth: '02-11',
      },
      {
        name: 'Proclamação da República',
        dayMonth: '15-11',
      },
      {
        name: 'Natal',
        dayMonth: '25-12',
      },
    ];
    await this.prisma.holiday.createMany({
      data: defaultHolidays.map((holiday) => ({
        name: holiday.name,
        dayMonth: holiday.dayMonth,
        companyId: companyId,
      })),
    });
  }
}
