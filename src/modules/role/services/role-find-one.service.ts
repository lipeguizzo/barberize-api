import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { RoleEntity } from '../domain/entities/role.entity';

@Injectable()
export class RoleFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<RoleEntity> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: id,
        deletedAt: null,
        OR: [
          {
            companyId: userRequest?.companyId ?? undefined,
            isDefault: false,
          },
          {
            isDefault: true,
          },
        ],
      },
      include: {
        company: true,
      },
    });

    if (!role) throw new NotFoundException('Perfil não encontrado!');

    return new RoleEntity(role);
  }
}
