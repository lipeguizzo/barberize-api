import { $Enums } from '@prisma/client';
import { UserRequest } from '../types/user-request';
import { PrismaService } from 'src/infra/database/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export async function userCompanyValidator(
  companyId: number,
  userRequest: UserRequest,
) {
  const prisma = new PrismaService();

  if (!userRequest) throw new UnauthorizedException('Usuário não encontrado!');

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      deletedAt: null,
    },
  });

  if (!company) throw new NotFoundException('Empresa não encontrada!');

  if (userRequest.role?.reference === $Enums.RoleReferences.ADMIN) return;

  if (userRequest.companyId !== companyId)
    throw new UnauthorizedException('Usuário sem permissão nessa empresa');
}
