import { Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { generatePaginationMeta } from 'src/shared/utils/generate-pagination-metadata';
import { CompanyFindManyDto } from '../domain/dto/company-find-many.dto';
import { CompanyEntity } from '../domain/entities/company.entity';

@Injectable()
export class CompanyFindManyService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: CompanyFindManyDto,
    userRequest: UserRequest,
  ): Promise<PaginationResponseDto<CompanyEntity>> {
    const [companies, totalCompanies] = await this.findCompanies(
      dto,
      userRequest,
    );

    return {
      data: companies.map((company) => new CompanyEntity(company)),
      _meta: generatePaginationMeta(
        '/companies',
        totalCompanies,
        dto.page,
        dto.pageSize,
        {
          ...dto,
          findAll: String(dto.findAll),
          includeDeleted: String(dto.includeDeleted),
        },
      ),
    };
  }

  private async findCompanies(
    params: CompanyFindManyDto,
    userRequest: UserRequest,
  ): Promise<[Company[], number]> {
    const dynamicWhere = this.generateDynamicWhere(params, userRequest);

    const orderBy = this.formatOrderByColumn(params);

    return this.prisma.$transaction([
      this.prisma.company.findMany({
        where: dynamicWhere,
        orderBy: orderBy,
        include: {
          address: true,
          avatar: true,
        },

        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

      this.prisma.company.count({ where: dynamicWhere }),
    ]);
  }

  private generateDynamicWhere(
    dto: CompanyFindManyDto,
    userRequest: UserRequest,
  ): Prisma.CompanyWhereInput {
    const dynamicWhere: Prisma.CompanyWhereInput = {
      id: userRequest?.companyId ?? undefined,
    };

    if (dto.search)
      dynamicWhere.OR = [
        { name: { contains: dto.search } },
        { tradeName: { contains: dto.search } },
        { email: { contains: dto.search } },
      ];

    if (dto.name) {
      dynamicWhere.name = { contains: dto.name };
    }

    if (dto.tradeName) {
      dynamicWhere.tradeName = { contains: dto.tradeName };
    }

    if (dto.email) {
      dynamicWhere.email = { contains: dto.email };
    }

    if (dto.status) {
      dynamicWhere.status = dto.status;
    }

    if (dto.state) {
      dynamicWhere.address = {
        state: { contains: dto.state },
      };
    }

    if (dto.city) {
      dynamicWhere.address = {
        city: { contains: dto.city },
      };
    }

    if (dto.street) {
      dynamicWhere.address = {
        street: { contains: dto.street },
      };
    }

    if (dto.neighborhood) {
      dynamicWhere.address = {
        neighborhood: { contains: dto.neighborhood },
      };
    }

    if (dto.findAll) {
      dynamicWhere.id = undefined;
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
    params: CompanyFindManyDto,
  ): Prisma.CompanyOrderByWithRelationInput {
    if (!params.orderBy) return { id: params.ordering };
    return { [params.orderBy]: params.ordering };
  }
}
