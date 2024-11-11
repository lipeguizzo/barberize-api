import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { UserUpdateStatusDto } from '../domain/dto/user-update-status.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserUpdateStatusService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: UserUpdateStatusDto,
    userRequest: UserRequest,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    const updatedUser = await this.prisma.user.update({
      data: {
        status: dto.status,
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
