import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HaircutUpdateDto } from '../domain/dto/haircut-update.dto';
import { HaircutEntity } from '../domain/entities/haircut.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class HaircutUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: HaircutUpdateDto,
    userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    const haircut = await this.prisma.haircut.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!haircut) throw new NotFoundException('Corte não encontrado!');

    const existingHaircut = await this.prisma.haircut.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [
          {
            name: dto.name,
          },
        ],
        deletedAt: null,
      },
    });

    if (existingHaircut) throw new ConflictException('Corte já cadastrado!');

    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }

    const updatedHaircut = await this.prisma.haircut.update({
      data: {
        name: dto.name,
        price: dto.price,
        duration: dto.duration,
        company: {
          update: {
            id: dto.companyId,
          },
        },
      },
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    return new HaircutEntity(updatedHaircut);
  }
}
