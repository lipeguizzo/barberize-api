import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HaircutEntity } from '../domain/entities/haircut.entity';
import { haircutDeleteValidator } from '../validators/haircut-delete.validator';

@Injectable()
export class HaircutDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<HaircutEntity> {
    const haircut = await this.prisma.haircut.findFirst({
      where: {
        id: id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!haircut) throw new NotFoundException('Corte não encontrado!');

    await haircutDeleteValidator(id);

    const updatedHaircut = await this.prisma.haircut.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
    });

    return new HaircutEntity(updatedHaircut);
  }
}
