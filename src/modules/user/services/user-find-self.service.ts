import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserFindSelfService {
  constructor(private prisma: PrismaService) {}
  async execute(userRequest: UserRequest): Promise<UserEntity> {
    if (!userRequest) throw new NotFoundException('Usuário não encontrado!');

    const user = await this.prisma.user.findFirst({
      where: {
        id: userRequest.id,
        deletedAt: null,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    return new UserEntity(user);
  }
}
