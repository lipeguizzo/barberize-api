import { Injectable } from '@nestjs/common';
import { Haircut, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { HaircutFindManyDto } from '../domain/dto/haircut-find-many.dto';
import { HaircutEntity } from '../domain/entities/haircut.entity';

@Injectable()
export class HaircutFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HaircutFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HaircutEntity>> {
    const [haircuts, totalHaircuts] = await this.findHaircuts(dto, userRequest);

    return {
      data: haircuts.map((haircut) => new HaircutEntity(haircut)),
      _meta: generatePaginationMeta(
        '/haircuts',
        totalHaircuts,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          includeDeleted: String(dto.includeDeleted),
        },
      ),
    };
  }

  private async findHaircuts(
    params: HaircutFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Haircut[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.haircut.findMany({
        where: dynamicWhere,
        orderBy: orderBy,

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.haircut.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: HaircutFindManyDto,
    userRequest: UserRequest,
  ): Prisma.HaircutWhereInput {
    const dynamicWhere: Prisma.HaircutWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.search) dynamicWhere.OR = [{ name: { contains: dto.search } }];

    if (dto.name) {
      dynamicWhere.name = { contains: dto.name };
    }

    if (dto.includeDeleted) {
      dynamicWhere.deletedAt =
        String(dto.includeDeleted) === 'true' ? undefined : null;
    } else {
      dynamicWhere.deletedAt = null;
    }

    if (dto.companyId) {
      dynamicWhere.companyId = dto.companyId;
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: HaircutFindManyDto,
  ): Prisma.HaircutOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
