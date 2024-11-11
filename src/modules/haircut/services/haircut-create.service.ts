import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { HaircutCreateDto } from '../domain/dto/haircut-create.dto';
import { HaircutEntity } from '../domain/entities/haircut.entity';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';

@Injectable()
export class HaircutCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: HaircutCreateDto,
    userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    const haircut = await this.prisma.haircut.findFirst({
      where: {
        OR: [
          {
            name: dto.name,
          },
        ],
        companyId: userRequest.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (haircut) throw new ConflictException('Corte já cadastrado!');

    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }

    const createdHaircut = await this.prisma.haircut.create({
      data: {
        name: dto.name,
        price: dto.price,
        duration: dto.duration,
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

    return new HaircutEntity(createdHaircut);
  }
}
