import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkingDayUpdateDto } from '../domain/dto/working-day-update.dto';
import { WorkingDayEntity } from '../domain/entities/working-day.entity';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class WorkingDayUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: WorkingDayUpdateDto,
    userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    const workingDay = await this.prisma.workingDay.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!workingDay) throw new NotFoundException('Dia não encontrado!');

    const existingWorkingDay = await this.prisma.workingDay.findFirst({
      where: {
        NOT: {
          id: id,
        },
        day: dto.day,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (existingWorkingDay) throw new ConflictException('Dia já cadastrado!');

    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }

    const updatedWorkingDay = await this.prisma.workingDay.update({
      data: {
        day: dto.day,
        isOpen: dto.isOpen,
        company: {
          update: {
            id: dto.companyId,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return new WorkingDayEntity(updatedWorkingDay);
  }
}
