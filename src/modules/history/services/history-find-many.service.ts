import { Injectable } from '@nestjs/common';
import { History, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { HistoryFindManyDto } from '../domain/dto/history-find-many.dto';
import { HistoryEntity } from '../domain/entities/history.entity';

@Injectable()
export class HistoryFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HistoryFindManyDto,
  ): Promise<PaginationResponseDto<HistoryEntity>> {
    const [histories, totalHistories] = await this.findHistories(dto);

    return {
      data: histories.map((history) => new HistoryEntity(history)),
      _meta: generatePaginationMeta(
        '/histories',
        totalHistories,
        dto.page,
        dto.pageSize,
        {
          ...dto,
        },
      ),
    };
  }

  private async findHistories(
    params: HistoryFindManyDto,
  ): Promise<[History[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.history.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          scheduling: {
            include: {
              horary: true,
              barber: true,
              client: true,
              company: {
                include: {
                  address: true,
                  avatar: true,
                },
              },
            },
          },
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.history.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: HistoryFindManyDto,
  ): Prisma.HistoryWhereInput {
    const dynamicWhere: Prisma.HistoryWhereInput = {};

    if (dto.search)
      dynamicWhere.OR = [
        {
          scheduling: {
            client: {
              name: { contains: dto.search },
            },
          },
        },
        {
          scheduling: {
            barber: {
              name: { contains: dto.search },
            },
          },
        },
      ];

    if (dto.clientId) {
      dynamicWhere.scheduling = { client: { id: dto.clientId } };
    }

    if (dto.clientName) {
      dynamicWhere.scheduling = {
        client: { name: { contains: dto.clientName } },
      };
    }

    if (dto.barberId) {
      dynamicWhere.scheduling = { barber: { id: dto.barberId } };
    }

    if (dto.barberName) {
      dynamicWhere.scheduling = {
        barber: { name: { contains: dto.barberName } },
      };
    }

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: HistoryFindManyDto,
  ): Prisma.HistoryOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
