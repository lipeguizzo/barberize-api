import { Injectable } from '@nestjs/common';
import { Horary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { HoraryFindManyDto } from '../domain/dto/horary-find-many.dto';
import { HoraryEntity } from '../domain/entities/horary.entity';

@Injectable()
export class HoraryFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HoraryFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HoraryEntity>> {
    const [hours, totalHours] = await this.findHours(dto, userRequest);

    return {
      data: hours.map((horary) => new HoraryEntity(horary)),
      _meta: generatePaginationMeta(
        '/hours',
        totalHours,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          isAvailable: String(dto.isAvailable),
        },
      ),
    };
  }

  private async findHours(
    params: HoraryFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Horary[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.horary.findMany({
        where: dynamicWhere,
        orderBy: orderBy,

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.horary.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: HoraryFindManyDto,
    userRequest: UserRequest,
  ): Prisma.HoraryWhereInput {
    const dynamicWhere: Prisma.HoraryWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.search) dynamicWhere.OR = [{ time: { contains: dto.search } }];

    if (dto.time) {
      dynamicWhere.time = { contains: dto.time };
    }

    if (dto.isAvailable) {
      dynamicWhere.isAvailable =
        String(dto.isAvailable) === 'true' ? true : false;
    }

    if (dto.companyId) {
      dynamicWhere.companyId = dto.companyId;
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: HoraryFindManyDto,
  ): Prisma.HoraryOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
