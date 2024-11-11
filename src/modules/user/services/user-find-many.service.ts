import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { UserFindManyDto } from '../domain/dto/user-find-many.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: UserFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<UserEntity>> {
    const [users, totalUsers] = await this.findUsers(dto, userRequest);

    return {
      data: users.map((user) => new UserEntity(user)),
      _meta: generatePaginationMeta(
        '/users',
        totalUsers,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          includeDeleted: String(dto.includeDeleted),
        },
      ),
    };
  }

  private async findUsers(
    params: UserFindManyDto,
    userRequest: UserRequest,
  ): Promise<[User[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.user.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          role: true,
          company: true,
          avatar: true,
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.user.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: UserFindManyDto,
    userRequest: UserRequest,
  ): Prisma.UserWhereInput {
    const dynamicWhere: Prisma.UserWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.search)
      dynamicWhere.OR = [
        { name: { contains: dto.search } },
        { email: { contains: dto.search } },
      ];

    if (dto.name) {
      dynamicWhere.name = { contains: dto.name };
    }

    if (dto.email) {
      dynamicWhere.email = { contains: dto.email };
    }

    if (dto.gender) {
      dynamicWhere.gender = dto.gender;
    }

    if (dto.roleId) {
      dynamicWhere.roleId = dto.roleId;
    }

    if (dto.roleReference) {
      dynamicWhere.role = { reference: dto.roleReference };
    }

    if (dto.companyId) {
      dynamicWhere.companyId = dto.companyId;
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
    params: UserFindManyDto,
  ): Prisma.UserOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
