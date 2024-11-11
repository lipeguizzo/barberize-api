import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserEntity } from '../domain/entities/user.entity';
import { UserRequest } from 'src/shared/types/user-request';
import { userDeleteValidator } from '../validators/user-delete.validator';

@Injectable()
export class UserDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    await userDeleteValidator(id);

    const updatedUser = await this.prisma.user.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    return new UserEntity(updatedUser);
  }
}
