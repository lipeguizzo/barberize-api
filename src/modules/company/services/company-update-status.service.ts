import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';
import { CompanyUpdateStatusDto } from '../domain/dto/company-update-status.dto';
import { CompanyEntity } from '../domain/entities/company.entity';

@Injectable()
export class CompanyUpdateStatusService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: CompanyUpdateStatusDto,
    userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    const company = await this.prisma.company.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada!');

    await userCompanyValidator(id, userRequest);

    const updatedCompany = await this.prisma.company.update({
      data: {
        status: dto.status,
      },
      where: {
        id: id,
      },
    });

    return new CompanyEntity(updatedCompany);
  }
}
