import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EFolder } from 'src/infra/file-system/domain/enums/folder.enum';
import { StoredFileCreateService } from 'src/modules/stored-file/services/stored-file-create.service';
import { StoredFileUpdateService } from 'src/modules/stored-file/services/stored-file-update.service';
import { UserRequest } from 'src/shared/types/user-request';
import { generateFileAdapterFromUploadFile } from 'src/shared/utils/file';
import { CompanyEntity } from '../domain/entities/company.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class CompanyUpdateAvatarService {
  constructor(
    private prisma: PrismaService,
    private storedFileCreateService: StoredFileCreateService,
    private storedFileUpdateService: StoredFileUpdateService,
  ) {}
  async execute(
    id: number,
    file: Express.Multer.File,
    userRequest: UserRequest,
  ): Promise<CompanyEntity> {
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

    if (!company) throw new NotFoundException('Empresa não encontrada!');

    if (!company?.avatar) {
      const storedFile = await this.storedFileCreateService.execute(
        generateFileAdapterFromUploadFile(file),
        {
          alt: file.originalname,
          name: file.originalname,
          relativePath: `${EFolder.COMPANIES}/${company.id}`,
          isPublic: true,
        },
      );

      const updatedCompany = await this.prisma.company.update({
        data: {
          avatar: {
            connect: {
              id: storedFile.id,
            },
          },
        },
        where: { id: company?.id },
        include: {
          avatar: true,
        },
      });
      return new CompanyEntity(updatedCompany);
    } else {
      const storedFile = await this.storedFileUpdateService.execute(
        company?.avatar?.uuid,
        generateFileAdapterFromUploadFile(file),
        {
          alt: file.originalname,
          name: file.originalname,
        },
      );

      const updatedCompany = await this.prisma.company.update({
        data: {
          avatar: {
            update: {
              id: storedFile.id,
            },
          },
        },
        where: { id: company?.id },
        include: {
          avatar: true,
        },
      });

      return new CompanyEntity(updatedCompany);
    }
  }
}
