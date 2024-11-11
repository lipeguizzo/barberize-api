import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma.service';
import { HolidayUpdateDto } from '../domain/dto/holiday-update.dto';

export async function holidayUpdateValidator(dto: HolidayUpdateDto) {
  const prisma = new PrismaService();

  const hasCompany = await prisma.company.findFirst({
    where: {
      id: dto.companyId,
    },
  });

  if (!hasCompany) throw new ConflictException('Empresa não encontrada!');
}
