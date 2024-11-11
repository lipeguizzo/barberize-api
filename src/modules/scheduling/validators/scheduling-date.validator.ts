import { $Enums } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { isBefore } from 'date-fns';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function schedulingDateValidator(date: Date, companyId: number) {
  const prisma = new PrismaService();

  const now: Date = new Date();
  const isSameDay: boolean = date.toDateString() === now.toDateString();

  if (isBefore(date, now) && !isSameDay) {
    throw new ConflictException(
      'Não é possível marcar agendamentos para o passado!',
    );
  }

  const dayOfWeek: number = date.getDay();
  const daysMap: $Enums.DayOfWeek[] = [
    $Enums.DayOfWeek.SUNDAY,
    $Enums.DayOfWeek.MONDAY,
    $Enums.DayOfWeek.TUESDAY,
    $Enums.DayOfWeek.WEDNESDAY,
    $Enums.DayOfWeek.THURSDAY,
    $Enums.DayOfWeek.FRIDAY,
    $Enums.DayOfWeek.SATURDAY,
  ];
  const selectedDay: $Enums.DayOfWeek = daysMap[dayOfWeek];

  const workingDay = await prisma.workingDay.findFirst({
    where: {
      companyId: companyId,
      day: selectedDay,
      isOpen: true,
    },
  });

  if (!workingDay) {
    throw new ConflictException('Barbearia está fechada nesse dia!');
  }

  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const day: string = String(date.getDate()).padStart(2, '0');
  const formattedDate: string = `${day}-${month}`;

  const holiday = await prisma.holiday.findFirst({
    where: {
      dayMonth: formattedDate,
      companyId: companyId ?? undefined,
    },
  });

  if (holiday)
    throw new ConflictException('Barbearia está fechada nesse feriado!');
}
