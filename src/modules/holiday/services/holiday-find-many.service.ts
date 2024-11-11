import { Injectable } from '@nestjs/common';
import { Holiday, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { HolidayFindManyDto } from '../domain/dto/holiday-find-many.dto';
import { HolidayEntity } from '../domain/entities/holiday.entity';

@Injectable()
export class HolidayFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HolidayFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HolidayEntity>> {
    const [holidays, totalHolidays] = await this.findHolidays(dto, userRequest);

    return {
      data: holidays.map((holiday) => new HolidayEntity(holiday)),
      _meta: generatePaginationMeta(
        '/holidays',
        totalHolidays,
        dto.page,
        dto.pageSize,
        {
          ...dto,
        },
      ),
    };
  }

  private async findHolidays(
    params: HolidayFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Holiday[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.holiday.findMany({
        where: dynamicWhere,
        orderBy: orderBy,

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.holiday.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: HolidayFindManyDto,
    userRequest: UserRequest,
  ): Prisma.HolidayWhereInput {
    const dynamicWhere: Prisma.HolidayWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.search)
      dynamicWhere.OR = [
        { name: { contains: dto.search } },
        {
          dayMonth: { contains: dto.search },
        },
      ];

    if (dto.name) {
      dynamicWhere.name = { contains: dto.name };
    }

    if (dto.dayMonth) {
      dynamicWhere.dayMonth = { contains: dto.dayMonth };
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: HolidayFindManyDto,
  ): Prisma.HolidayOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
