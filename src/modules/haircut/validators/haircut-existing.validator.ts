import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function haircutExistingValidator(
  haircutId: number,
  companyId?: number,
) {
  const prisma = new PrismaService();

  const haircut = await prisma.haircut.findFirst({
    where: {
      id: haircutId,
      companyId: companyId ?? undefined,
    },
  });

  if (!haircut) throw new NotFoundException('Corte não encontrado!');
}
