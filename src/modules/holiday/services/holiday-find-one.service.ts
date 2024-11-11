import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HolidayEntity } from '../domain/entities/holiday.entity';

@Injectable()
export class HolidayFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<HolidayEntity> {
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
      include: {
        company: true,
      },
    });

    if (!holiday) throw new NotFoundException('Feriado não encontrado!');

    return new HolidayEntity(holiday);
  }
}
