import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RoleEntity } from '../domain/entities/role.entity';
import { UserRequest } from 'src/shared/types/user-request';
import { roleDefaultValidator } from '../validators/role-default.validator';
import { roleReferenceValidator } from '../validators/role-reference.validator';
import { roleDeleteValidator } from '../validators/role-delete.validator';

@Injectable()
export class RoleDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<RoleEntity> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!role) throw new NotFoundException('Perfil não encontrado!');

    roleDefaultValidator(role);

    if (role.reference)
      await roleReferenceValidator(role.reference, userRequest);

    await roleDeleteValidator(id);

    const updatedRole = await this.prisma.role.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    await this.prisma.roleAbility.deleteMany({
      where: { roleId: updatedRole.id },
    });

    return new RoleEntity(updatedRole);
  }
}
