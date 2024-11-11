import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HolidayUpdateDto } from '../domain/dto/holiday-update.dto';
import { HolidayEntity } from '../domain/entities/holiday.entity';
import { holidayUpdateValidator } from '../validators/holiday-update.validator';

@Injectable()
export class HolidayUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: HolidayUpdateDto,
    userRequest: UserRequest,
  ): Promise<HolidayEntity> {
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!holiday) throw new NotFoundException('Feriado não encontrado!');

    await holidayUpdateValidator(dto);

    const existingHoliday = await this.prisma.holiday.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [
          {
            dayMonth: { equals: dto.dayMonth },
          },
        ],
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (existingHoliday) throw new ConflictException('Feriado já cadastrado!');

    const updatedHoliday = await this.prisma.holiday.update({
      data: {
        name: dto.name,
        dayMonth: dto.dayMonth,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
      },
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    return new HolidayEntity(updatedHoliday);
  }
}
