import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function companyDeleteValidator(companyId: number) {
  const prisma = new PrismaService();

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      deletedAt: null,
    },
  });

  if (!company) throw new NotFoundException('Empresa não encontrada!');

  const hasUsers = await prisma.user.findFirst({
    where: {
      companyId: companyId,
      deletedAt: null,
    },
  });

  if (hasUsers)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui usuários vinculados!',
    );

  const hasRoles = await prisma.role.findFirst({
    where: {
      companyId: companyId,
      deletedAt: null,
    },
  });

  if (hasRoles)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui perfis vinculados!',
    );

  const hasHaircuts = await prisma.haircut.findFirst({
    where: {
      companyId: companyId,
      deletedAt: null,
    },
  });

  if (hasHaircuts)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui cortes vinculados!',
    );

  const hasHours = await prisma.horary.findFirst({
    where: {
      companyId: companyId,
    },
  });

  if (hasHours)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui horários vinculados!',
    );

  const hasSchedulings = await prisma.scheduling.findFirst({
    where: {
      companyId: companyId,
    },
  });

  if (hasSchedulings)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui agendamentos vinculados!',
    );

  const hasAssessments = await prisma.assessment.findFirst({
    where: {
      companyId: companyId,
    },
  });

  if (hasAssessments)
    throw new ConflictException(
      'Não foi possível deletar empresa por que possui avaliações vinculadas!',
    );
}
