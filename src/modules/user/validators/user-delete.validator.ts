import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function userDeleteValidator(userId: number) {
  const prisma = new PrismaService();

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) throw new NotFoundException('Usuário não encontrado!');

  const hasSchedulings = await prisma.scheduling.findFirst({
    where: {
      OR: [{ clientId: userId }, { barberId: userId }],
    },
  });

  if (hasSchedulings)
    throw new ConflictException(
      'Não foi possível deletar usuário por que possui agendamentos vinculados!',
    );

  const hasAssessments = await prisma.assessment.findFirst({
    where: {
      OR: [{ clientId: userId }, { barberId: userId }],
    },
  });

  if (hasAssessments)
    throw new ConflictException(
      'Não foi possível deletar usuário por que possui avaliações vinculadas!',
    );
}
