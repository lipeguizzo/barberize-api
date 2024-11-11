import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { companyExistingValidator } from 'src/modules/company/validators/company-existing.validator';
import { barberExistingValidator } from 'src/modules/user/validators/barber-existing.validator';
import { clientExistingValidator } from 'src/modules/user/validators/client-existing.validator';
import { UserRequest } from 'src/shared/types/user-request';
import { AssessmentUpdateDto } from '../domain/dto/assessment-update.dto';
import { AssessmentEntity } from '../domain/entities/assessment.entity';

@Injectable()
export class AssessmentUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: AssessmentUpdateDto,
    userRequest: UserRequest,
  ): Promise<AssessmentEntity> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!assessment) throw new NotFoundException('Avaliação não encontrada!');

    await companyExistingValidator(dto.companyId);
    await clientExistingValidator(dto.clientId);
    await barberExistingValidator(dto.barberId, dto.companyId);

    const updatedAssessment = await this.prisma.assessment.update({
      data: {
        score: dto.score,
        commentary: dto.commentary,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
        client: {
          connect: {
            id: dto.clientId,
          },
        },
        barber: {
          connect: {
            id: dto.barberId,
          },
        },
      },
      where: {
        id: id,
      },
      include: {
        company: true,
        client: true,
        barber: true,
      },
    });

    return new AssessmentEntity(updatedAssessment);
  }
}
