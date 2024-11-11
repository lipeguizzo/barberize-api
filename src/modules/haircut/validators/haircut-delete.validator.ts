import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function haircutDeleteValidator(haircutId: number) {
  const prisma = new PrismaService();

  const haircut = await prisma.haircut.findFirst({
    where: {
      id: haircutId,
      deletedAt: null,
    },
  });

  if (!haircut) throw new NotFoundException('Corte não encontrado!');

  const hasSchedulings = await prisma.scheduling.findFirst({
    where: {
      haircutId: haircutId,
    },
  });

  if (hasSchedulings)
    throw new ConflictException(
      'Não foi possível deletar corte por que possui agendamentos vinculados!',
    );
}
