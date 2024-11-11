import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function clientExistingValidator(clientId: number) {
  const prisma = new PrismaService();

  const client = await prisma.user.findFirst({
    where: {
      id: clientId,
    },
  });

  if (!client) throw new NotFoundException('Cliente não encontrado!');
}
