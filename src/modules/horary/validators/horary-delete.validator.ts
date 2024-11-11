import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function horaryDeleteValidator(horaryId: number) {
  const prisma = new PrismaService();

  const horary = await prisma.horary.findFirst({
    where: {
      id: horaryId,
    },
  });

  if (!horary) throw new NotFoundException('Horário não encontrado!');

  const hasSchedulings = await prisma.scheduling.findFirst({
    where: {
      horaryId: horaryId,
    },
  });

  if (hasSchedulings)
    throw new ConflictException(
      'Não foi possível deletar horário por que possui agendamentos vinculados!',
    );
}
