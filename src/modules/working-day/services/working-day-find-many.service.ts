import { Injectable } from '@nestjs/common';
import { Prisma, WorkingDay } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { WorkingDayFindManyDto } from '../domain/dto/working-day-find-many.dto';
import { WorkingDayEntity } from './../domain/entities/working-day.entity';

@Injectable()
export class WorkingDayFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: WorkingDayFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<WorkingDayEntity>> {
    const [workingDays, totalWorkingDays] = await this.findWorkingDays(
      dto,
      userRequest,
    );

    return {
      data: workingDays.map((workingDay) => new WorkingDayEntity(workingDay)),
      _meta: generatePaginationMeta(
        '/working-days',
        totalWorkingDays,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          isOpen: String(dto.isOpen),
        },
      ),
    };
  }

  private async findWorkingDays(
    params: WorkingDayFindManyDto,
    userRequest: UserRequest,
  ): Promise<[WorkingDay[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.workingDay.findMany({
        where: dynamicWhere,
        orderBy: orderBy,

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.workingDay.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: WorkingDayFindManyDto,
    userRequest: UserRequest,
  ): Prisma.WorkingDayWhereInput {
    const dynamicWhere: Prisma.WorkingDayWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.day) {
      dynamicWhere.day = dto.day;
    }

    if (dto.isOpen) {
      dynamicWhere.isOpen = String(dto.isOpen) === 'true' ? true : false;
    }

    if (dto.companyId) {
      dynamicWhere.companyId = dto.companyId;
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: WorkingDayFindManyDto,
  ): Prisma.WorkingDayOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
