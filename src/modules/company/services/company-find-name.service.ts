import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CompanyEntity } from '../domain/entities/company.entity';

@Injectable()
export class CompanyFindNameService {
  constructor(private prisma: PrismaService) {}
  async execute(name: string): Promise<CompanyEntity> {
    const company = await this.prisma.company.findFirst({
      where: {
        name: name,
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
