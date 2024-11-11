import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { RoleUpdateStatusDto } from '../domain/dto/role-update-status.dto';
import { RoleEntity } from '../domain/entities/role.entity';
import { roleDefaultValidator } from '../validators/role-default.validator';
import { roleReferenceValidator } from '../validators/role-reference.validator';

@Injectable()
export class RoleUpdateStatusService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: RoleUpdateStatusDto,
    userRequest: UserRequest,
  ): Promise<RoleEntity> {
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

    const updatedRole = await this.prisma.role.update({
      data: {
        status: dto.status,
      },
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    return new RoleEntity(updatedRole);
  }
}
