import { $Enums } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function barberExistingValidator(
  barberId: number,
  companyId?: number,
) {
  const prisma = new PrismaService();

  const barber = await prisma.user.findFirst({
    where: {
      id: barberId,
      companyId: companyId ?? undefined,
    },
    include: {
      role: true,
    },
  });

  if (!barber) throw new NotFoundException('Barbeiro não encontrado!');

  if (barber.role?.reference !== $Enums.RoleReferences.PROFESSIONAL)
    throw new ConflictException(
      'Barbeiro não possui perfil referencia como (Profissional)!',
    );
}
