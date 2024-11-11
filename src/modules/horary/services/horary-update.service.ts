import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HoraryUpdateDto } from '../domain/dto/horary-update.dto';
import { HoraryEntity } from '../domain/entities/horary.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class HoraryUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: HoraryUpdateDto,
    userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    const horary = await this.prisma.horary.findFirst({
      where: {
        id: id,
      },
    });

    if (!horary) throw new NotFoundException('Horário não encontrado!');

    const existingHorary = await this.prisma.horary.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [
          {
            time: dto.time,
          },
        ],
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (existingHorary) throw new ConflictException('Horário já cadastrado!');

    if (dto.companyId) {
      await userCompanyValidator(dto.companyId, userRequest);
    }

    const updatedHorary = await this.prisma.horary.update({
      data: {
        time: dto.time,
        isAvailable: dto.isAvailable,
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

    return new HoraryEntity(updatedHorary);
  }
}
