import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

export async function companyExistingValidator(companyId: number) {
  const prisma = new PrismaService();

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
    },
  });

  if (!company) throw new NotFoundException('Empresa não encontrada!');
}
