import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { StoredFileDeleteService } from 'src/modules/stored-file/services/stored-file-delete.service';
import { UserRequest } from 'src/shared/types/user-request';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserDeleteAvatarService {
  constructor(
    private prisma: PrismaService,
    private storedFileDeleteService: StoredFileDeleteService,
  ) {}
  async execute(userRequest: UserRequest): Promise<UserEntity> {
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

    if (!user) throw new NotFoundException('Arquivo não encontrado!');

    const updatedUser = await this.prisma.user.update({
      data: {
        avatarId: null,
      },
      where: {
        id: user.id,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    await this.storedFileDeleteService.execute(user.avatar.uuid);

    return new UserEntity(updatedUser);
  }
}
