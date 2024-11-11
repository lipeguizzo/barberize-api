import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AssessmentEntity } from '../domain/entities/assessment.entity';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class AssessmentFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    userRequest: UserRequest,
  ): Promise<AssessmentEntity> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
      include: {
        company: true,
        client: true,
        barber: true,
      },
    });

    if (!assessment) throw new NotFoundException('Avaliação não encontrada!');

    return new AssessmentEntity(assessment);
  }
}
