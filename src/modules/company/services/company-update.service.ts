import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';
import { CompanyUpdateDto } from '../domain/dto/company-update.dto';
import { CompanyEntity } from '../domain/entities/company.entity';

@Injectable()
export class CompanyUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: CompanyUpdateDto,
    userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    const company = await this.prisma.company.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada!');

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [
          {
            name: dto.name,
          },
          {
            email: dto.email,
          },
        ],
        deletedAt: null,
      },
    });

    if (existingCompany) throw new ConflictException('Empresa já cadastrada!');

    await userCompanyValidator(id, userRequest);

    const updatedCompany = await this.prisma.company.update({
      data: {
        name: dto.name,
        tradeName: dto.tradeName,
        email: dto.email,
        status: dto.status,
        address: {
          update: dto.address,
        },
      },
      where: {
        id: id,
      },
    });

    return new CompanyEntity(updatedCompany);
  }
}
