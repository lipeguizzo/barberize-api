import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class AssessmentDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<void> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        id: id,
        clientId: userRequest.id,
      },
    });

    if (!assessment) throw new NotFoundException('Avaliação não encontrada!');

    await this.prisma.assessment.delete({
      where: {
        id: id,
      },
    });
  }
}
