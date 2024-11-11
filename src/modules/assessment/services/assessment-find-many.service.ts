import { Injectable } from '@nestjs/common';
import { Assessment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { AssessmentFindManyDto } from '../domain/dto/assessment-find-many.dto';
import { AssessmentEntity } from '../domain/entities/assessment.entity';

@Injectable()
export class AssessmentFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: AssessmentFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<AssessmentEntity>> {
    const [assessments, totalAssessments] = await this.findAssessments(
      dto,
      userRequest,
    );

    return {
      data: assessments.map((assessment) => new AssessmentEntity(assessment)),
      _meta: generatePaginationMeta(
        '/assessments',
        totalAssessments,
        dto.page,
        dto.pageSize,
        {
          ...dto,
        },
      ),
    };
  }

  private async findAssessments(
    params: AssessmentFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Assessment[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.assessment.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          company: true,
          client: true,
          barber: true,
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.assessment.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: AssessmentFindManyDto,
    userRequest: UserRequest,
  ): Prisma.AssessmentWhereInput {
    const dynamicWhere: Prisma.AssessmentWhereInput = {
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

    return dynamicWhere;
  }

  private formatOrderByColumn(
    params: AssessmentFindManyDto,
  ): Prisma.AssessmentOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
