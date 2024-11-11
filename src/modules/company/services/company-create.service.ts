import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CompanyCreateDto } from '../domain/dto/company-create.dto';
import { CompanyEntity } from '../domain/entities/company.entity';
import { WorkingDayCreateDefaultService } from 'src/modules/working-day/services/working-day-create-default.service';
import { HolidayCreateDefaultService } from 'src/modules/holiday/services/holiday-create-default.service';

@Injectable()
export class CompanyCreateService {
  constructor(
    private prisma: PrismaService,
    private workingDayCreateDefaultService: WorkingDayCreateDefaultService,
    private holidayCreateDefaultService: HolidayCreateDefaultService,
  ) {}
  async execute(dto: CompanyCreateDto): Promise<CompanyEntity> {
    const company = await this.prisma.company.findFirst({
      where: {
        OR: [
          {
            name: dto.name,
          },
          {
            email: dto.email,
          },
        ],
        deletedAt: null,
      },
    });

    if (company) throw new ConflictException('Empresa já cadastrada!');

    const createdCompany = await this.prisma.company.create({
      data: {
        name: dto.name,
        tradeName: dto.tradeName,
        email: dto.email,
        status: dto.status,
        address: {
          create: dto.address,
        },
      },
      include: {
        address: true,
      },
    });

    await this.workingDayCreateDefaultService.execute(createdCompany.id);
    await this.holidayCreateDefaultService.execute(createdCompany.id);

    return new CompanyEntity(createdCompany);
  }
}
