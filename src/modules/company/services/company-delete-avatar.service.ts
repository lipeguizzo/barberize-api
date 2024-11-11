import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { StoredFileDeleteService } from 'src/modules/stored-file/services/stored-file-delete.service';
import { UserRequest } from 'src/shared/types/user-request';
import { CompanyEntity } from '../domain/entities/company.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class CompanyDeleteAvatarService {
  constructor(
    private prisma: PrismaService,
    private storedFileDeleteService: StoredFileDeleteService,
  ) {}
  async execute(id: number, userRequest: UserRequest): Promise<CompanyEntity> {
    await userCompanyValidator(id, userRequest);

    const company = await this.prisma.company.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        avatar: true,
      },
    });

    if (!company) throw new NotFoundException('Arquivo não encontrado!');

    const updatedCompany = await this.prisma.company.update({
      data: {
        avatarId: null,
      },
      where: {
        id: company.id,
      },
      include: {
        avatar: true,
      },
    });

    await this.storedFileDeleteService.execute(company.avatar.uuid);

    return new CompanyEntity(updatedCompany);
  }
}
