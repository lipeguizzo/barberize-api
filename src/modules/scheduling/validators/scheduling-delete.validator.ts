import { PrismaService } from '../../../infra/database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

export async function schedulingDeleteValidator(schedulingId: number) {
  const prisma = new PrismaService();

  const scheduling = await prisma.horary.findFirst({
    where: {
      id: schedulingId,
    },
  });

  if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

  const hasHistories = await prisma.history.findFirst({
    where: {
      schedulingId: schedulingId,
    },
  });

  if (hasHistories)
    throw new ConflictException(
      'Não foi possível deletar agendamento por que possui históricos vinculados!',
    );
}
