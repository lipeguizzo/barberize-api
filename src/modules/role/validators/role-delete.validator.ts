import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function roleDeleteValidator(roleId: number) {
  const prisma = new PrismaService();

  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
      deletedAt: null,
    },
  });

  if (!role) throw new NotFoundException('Perfil não encontrado!');

  const hasUsers = await prisma.user.findFirst({
    where: {
      roleId: roleId,
      deletedAt: null,
    },
  });

  if (hasUsers)
    throw new ConflictException(
      'Não foi possível deletar perfil por que possui usuários vinculados!',
    );
}
