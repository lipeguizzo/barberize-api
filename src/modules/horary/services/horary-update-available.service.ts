import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HoraryUpdateAvailableDto } from '../domain/dto/horary-update-available.dto';
import { HoraryEntity } from '../domain/entities/horary.entity';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class HoraryUpdateAvailableService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: HoraryUpdateAvailableDto,
    userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    const horary = await this.prisma.horary.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!horary) throw new NotFoundException('Horário não encontrado!');

    const updatedHorary = await this.prisma.horary.update({
      data: {
        isAvailable: dto.isAvailable,
      },
      where: {
        id: id,
      },
    });

    return new HoraryEntity(updatedHorary);
  }
}
