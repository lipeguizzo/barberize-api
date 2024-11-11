import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function horaryExistingValidator(
  horaryId: number,
  companyId?: number,
) {
  const prisma = new PrismaService();

  const horary = await prisma.horary.findFirst({
    where: {
      id: horaryId,
      companyId: companyId ?? undefined,
    },
  });

  if (!horary) throw new NotFoundException('Horário não encontrado!');

  if (horary.isAvailable === false)
    throw new ConflictException('Horário não está disponível!');
}
