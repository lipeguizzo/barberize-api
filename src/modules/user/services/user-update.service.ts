import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';
import { userRoleValidator } from 'src/shared/validators/user-role.validator';
import { UserUpdateDto } from '../domain/dto/user-update.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserUpdateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    id: number,
    dto: UserUpdateDto,
    userRequest: UserRequest,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        companyId: userRequest?.companyId ?? undefined,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado!');

    const existingUser = await this.prisma.user.findFirst({
      where: {
        NOT: {
          id: id,
        },
        OR: [
          {
            name: dto.name,
          },
          {
            email: dto.email,
          },
        ],
        deletedAt: null,
      },
    });

    if (existingUser) throw new ConflictException('Usuário já cadastrado!');

    if (dto.roleId) await userRoleValidator(dto?.roleId, userRequest);

    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password, 10),
        gender: dto.gender,
        phone: dto.phone,
        company: dto.companyId
          ? {
              connect: {
                id: dto?.companyId,
              },
            }
          : undefined,
        role: dto.roleId
          ? {
              connect: {
                id: dto?.roleId,
              },
            }
          : undefined,
        status: dto.status,
      },
      where: {
        id: id,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    return new UserEntity(updatedUser);
  }
}
