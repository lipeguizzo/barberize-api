import { ConflictException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function schedulingExistingValidator(
  date: Date,
  horaryId: number,
  companyId: number,
  barberId: number,
  clientId: number,
) {
  const prisma = new PrismaService();

  const targetDate = new Date(date);

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingScheduling = await prisma.scheduling.findFirst({
    where: {
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
      clientId: clientId,
      barberId: barberId,
      horaryId: horaryId,
      companyId: companyId,
      status: {
        notIn: [
          $Enums.SchedulingStatus.COMPLETED,
          $Enums.SchedulingStatus.CANCELED,
        ],
      },
    },
  });

  if (existingScheduling) {
    throw new ConflictException('Já existe um agendamento para este horário!');
  }
}
