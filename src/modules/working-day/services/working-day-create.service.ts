import { UserRequest } from 'src/shared/types/user-request';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkingDayCreateDto } from '../domain/dto/working-day-create.dto';
import { WorkingDayEntity } from '../domain/entities/working-day.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class WorkingDayCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: WorkingDayCreateDto,
    userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }
    const workingDay = await this.prisma.workingDay.findFirst({
      where: {
        OR: [
          {
            day: dto.day,
          },
        ],
        companyId: dto.companyId,
      },
    });

    if (workingDay) throw new ConflictException('Dia já cadastrado!');

    const createdWorkingDay = await this.prisma.workingDay.create({
      data: {
        day: dto.day,
        isOpen: dto.isOpen,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
      },
      include: {
        company: true,
      },
    });

    return new WorkingDayEntity(createdWorkingDay);
  }
}
