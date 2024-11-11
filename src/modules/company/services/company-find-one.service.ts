import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CompanyEntity } from '../domain/entities/company.entity';

@Injectable()
export class CompanyFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number): Promise<CompanyEntity> {
    const company = await this.prisma.company.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        address: true,
        avatar: true,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada!');

    return new CompanyEntity(company);
  }
}
