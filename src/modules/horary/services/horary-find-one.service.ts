import { UserRequest } from 'src/shared/types/user-request';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HoraryEntity } from '../domain/entities/horary.entity';

@Injectable()
export class HoraryFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<HoraryEntity> {
    const horary = await this.prisma.horary.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
      include: { company: true },
    });

    if (!horary) throw new NotFoundException('Horário não encontrado!');

    return new HoraryEntity(horary);
  }
}
