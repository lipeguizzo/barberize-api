import { Injectable } from '@nestjs/common';
import { Prisma, Scheduling } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { SchedulingFindManyDto } from '../domain/dto/scheduling-find-many.dto';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';

@Injectable()
export class SchedulingFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: SchedulingFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<SchedulingEntity>> {
    const [schedulings, totalSchedulings] = await this.findSchedulings(
      dto,
      userRequest,
    );

    return {
      data: schedulings.map((scheduling) => new SchedulingEntity(scheduling)),
      _meta: generatePaginationMeta(
        '/schedulings',
        totalSchedulings,
        dto.page,
        dto.pageSize,
        {
          ...dto,
        },
      ),
    };
  }

  private async findSchedulings(
    params: SchedulingFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Scheduling[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.scheduling.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          company: true,
          horary: true,
          haircut: true,
          client: true,
          barber: true,
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.scheduling.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: SchedulingFindManyDto,
    userRequest: UserRequest,
  ): Prisma.SchedulingWhereInput {
    const dynamicWhere: Prisma.SchedulingWhereInput = {
      companyId: userRequest?.companyId ?? undefined,
    };

    if (dto.search)
      dynamicWhere.OR = [
        {
          client: {
            name: { contains: dto.search },
          },
        },
        {
          barber: {
            name: { contains: dto.search },
          },
        },
      ];

    if (dto.date) {
      const targetDate = new Date(dto.date);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      dynamicWhere.date = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    if (dto.clientId) {
      dynamicWhere.clientId = dto.clientId;
    }

    if (dto.clientName) {
      dynamicWhere.client = {
        name: { contains: dto.clientName },
      };
    }

    if (dto.barberId) {
      dynamicWhere.barberId = dto.barberId;
    }

    if (dto.barberName) {
      dynamicWhere.barber = {
        name: { contains: dto.barberName },
      };
    }

    if (dto.companyId) {
      dynamicWhere.companyId = dto.companyId;
    }

    if (dto.status?.length) {
      dynamicWhere.status = { in: dto.status };
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: SchedulingFindManyDto,
  ): Prisma.SchedulingOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
