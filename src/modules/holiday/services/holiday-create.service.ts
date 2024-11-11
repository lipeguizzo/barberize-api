import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HolidayCreateDto } from '../domain/dto/holiday-create.dto';
import { HolidayEntity } from '../domain/entities/holiday.entity';
import { holidayCreateValidator } from '../validators/holiday-create.validator';

@Injectable()
export class HolidayCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(dto: HolidayCreateDto): Promise<HolidayEntity> {
    await holidayCreateValidator(dto);

    const createdHoliday = await this.prisma.holiday.create({
      data: {
        name: dto.name,
        dayMonth: dto.dayMonth,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
      },
      include: {
        company: true,
      },
    });

    return new HolidayEntity(createdHoliday);
  }
}
