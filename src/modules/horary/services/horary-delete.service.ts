import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { horaryDeleteValidator } from '../validators/horary-delete.validator';
import { UserRequest } from 'src/shared/types/user-request';

@Injectable()
export class HoraryDeleteService {
  constructor(private prisma: PrismaService) {}
  async execute(id: number, userRequest: UserRequest): Promise<void> {
    const horary = await this.prisma.horary.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!horary) throw new NotFoundException('Horário não encontrado!');

    await horaryDeleteValidator(id);

    await this.prisma.horary.delete({
      where: {
        id: id,
      },
    });
  }
}
