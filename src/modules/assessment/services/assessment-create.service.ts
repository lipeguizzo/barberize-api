import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { companyExistingValidator } from 'src/modules/company/validators/company-existing.validator';
import { barberExistingValidator } from 'src/modules/user/validators/barber-existing.validator';
import { clientExistingValidator } from 'src/modules/user/validators/client-existing.validator';
import { AssessmentCreateDto } from '../domain/dto/assessment-create.dto';
import { AssessmentEntity } from '../domain/entities/assessment.entity';

@Injectable()
export class AssessmentCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(dto: AssessmentCreateDto): Promise<AssessmentEntity> {
    await companyExistingValidator(dto.companyId);
    await clientExistingValidator(dto.clientId);
    await barberExistingValidator(dto.barberId, dto.companyId);

    const createdAssessment = await this.prisma.assessment.create({
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
      include: {
        company: true,
        client: true,
        barber: true,
      },
    });

    return new AssessmentEntity(createdAssessment);
  }
}
