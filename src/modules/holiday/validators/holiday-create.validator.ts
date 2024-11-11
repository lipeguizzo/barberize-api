import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma.service';
import { HolidayCreateDto } from '../domain/dto/holiday-create.dto';

export async function holidayCreateValidator(dto: HolidayCreateDto) {
  const prisma = new PrismaService();

  const hasCompany = await prisma.company.findFirst({
    where: {
      id: dto.companyId,
    },
  });

  if (!hasCompany) throw new ConflictException('Empresa não encontrada!');

  const holiday = await prisma.holiday.findFirst({
    where: {
      dayMonth: { equals: dto.dayMonth },
      companyId: dto.companyId,
    },
  });

  if (holiday) throw new ConflictException('Feriado já cadastrado!');
}
