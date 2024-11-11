import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class HolidayDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<void> {
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!holiday) throw new NotFoundException('Feriado não encontrado!');

    await this.prisma.holiday.delete({
      where: {
        id: id,
      },
    });
  }
}
