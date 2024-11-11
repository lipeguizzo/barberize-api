import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HaircutEntity } from '../domain/entities/haircut.entity';

@Injectable()
export class HaircutFindOneService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<HaircutEntity> {
    const haircut = await this.prisma.haircut.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
        deletedAt: null,
      },
      include: { company: true },
    });

    if (!haircut) throw new NotFoundException('Corte não encontrado!');

    return new HaircutEntity(haircut);
  }
}
