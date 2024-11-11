import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { AbilityEntity } from './../domain/entities/ability.entity';

@Injectable()
export class RoleFindAbilitiesService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    userRequest: UserRequest,
  ): Promise<AbilityEntity[]> {
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
    });

    if (!role) throw new NotFoundException('Perfil não encontrado!');
    const findAbilities = await this.prisma.ability.findMany({
      where: {
        rolesAbilities: {
          some: {
            roleId: id,
          },
        },
      },
    });

    return findAbilities.map((ability) => new AbilityEntity(ability));
  }
}
