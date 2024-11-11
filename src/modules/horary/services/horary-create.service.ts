import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { HoraryCreateDto } from '../domain/dto/horary-create.dto';
import { HoraryEntity } from '../domain/entities/horary.entity';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class HoraryCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HoraryCreateDto,
    userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    if (dto.companyId) {
      await userCompanyValidator(dto.companyId, userRequest);
    }

    const horary = await this.prisma.horary.findFirst({
      where: {
        OR: [
          {
            time: dto.time,
          },
        ],
        companyId: dto.companyId,
      },
    });

    if (horary) throw new ConflictException('Horário já cadastrado!');

    const createdHorary = await this.prisma.horary.create({
      data: {
        time: dto.time,
        isAvailable: dto.isAvailable,
        company: {
          connect: {
            id: dto.companyId,
          },
        },
      },
      include: {
        company: true,
      },
    });

    return new HoraryEntity(createdHorary);
  }
}
