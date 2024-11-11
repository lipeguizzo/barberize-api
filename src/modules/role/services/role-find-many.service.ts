import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { RoleEntity } from '../domain/entities/role.entity';
import { RoleFindManyDto } from './../domain/dto/role-find-many.dto';
import { roleReferencePermission } from '../helpers/role-reference-permission.helper';

@Injectable()
export class RoleFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: RoleFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<RoleEntity>> {
    const [roles, totalRoles] = await this.findRoles(dto, userRequest);

    return {
      data: roles.map((role) => new RoleEntity(role)),
      _meta: generatePaginationMeta(
        '/roles',
        totalRoles,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          isDefault: String(dto.isDefault),
          includeDeleted: String(dto.includeDeleted),
        },
      ),
    };
  }

  private async findRoles(
    params: RoleFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Role[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.role.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          company: true,
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.role.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: RoleFindManyDto,
    userRequest: UserRequest,
  ): Prisma.RoleWhereInput {
    const dynamicWhere: Prisma.RoleWhereInput = {
      OR: [
        {
          companyId: userRequest?.companyId ?? undefined,
          isDefault: false,
        },
        {
          isDefault: true,
        },
      ],
    };

    const rolePermissions = roleReferencePermission(userRequest);

    if (rolePermissions.length > 0) {
      dynamicWhere.AND = {
        OR: rolePermissions,
      };
    }

    if (dto.search)
      dynamicWhere.OR?.map(
        (element) => (element.AND = { name: { contains: dto.search } }),
      );

    if (dto.name) {
      dynamicWhere.name = { contains: dto.name };
    }

    if (dto.isDefault) {
      dynamicWhere.isDefault = String(dto.isDefault) === 'true' ? true : false;
    }

    if (dto.reference) {
      dynamicWhere.reference = dto.reference;
    }

    if (dto.status) {
      dynamicWhere.status = dto.status;
    }

    if (dto.includeDeleted) {
      dynamicWhere.deletedAt =
        String(dto.includeDeleted) === 'true' ? undefined : null;
    } else {
      dynamicWhere.deletedAt = null;
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: RoleFindManyDto,
  ): Prisma.RoleOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
