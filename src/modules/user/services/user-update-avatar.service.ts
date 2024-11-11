import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EFolder } from 'src/infra/file-system/domain/enums/folder.enum';
import { StoredFileCreateService } from 'src/modules/stored-file/services/stored-file-create.service';
import { StoredFileUpdateService } from 'src/modules/stored-file/services/stored-file-update.service';
import { UserRequest } from 'src/shared/types/user-request';
import { generateFileAdapterFromUploadFile } from 'src/shared/utils/file';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserUpdateAvatarService {
  constructor(
    private prisma: PrismaService,
    private storedFileCreateService: StoredFileCreateService,
    private storedFileUpdateService: StoredFileUpdateService,
  ) {}
  async execute(
    file: Express.Multer.File,
    userRequest: UserRequest,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userRequest?.id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    if (!user.avatar) {
      const storedFile = await this.storedFileCreateService.execute(
        generateFileAdapterFromUploadFile(file),
        {
          alt: file.originalname,
          name: file.originalname,
          relativePath: `${EFolder.USERS}/${userRequest?.id}`,
          isPublic: true,
        },
      );

      const updatedUser = await this.prisma.user.update({
        data: {
          avatar: {
            connect: {
              id: storedFile.id,
            },
          },
        },
        where: { id: userRequest?.id },
        include: {
          role: true,
          company: true,
          avatar: true,
        },
      });
      return new UserEntity(updatedUser);
    } else {
      const storedFile = await this.storedFileUpdateService.execute(
        user?.avatar?.uuid,
        generateFileAdapterFromUploadFile(file),
        {
          alt: file.originalname,
          name: file.originalname,
        },
      );

      const updatedUser = await this.prisma.user.update({
        data: {
          avatar: {
            update: {
              id: storedFile.id,
            },
          },
        },
        where: { id: userRequest?.id },
        include: {
          role: true,
          company: true,
          avatar: true,
        },
      });

      return new UserEntity(updatedUser);
    }
  }
}
