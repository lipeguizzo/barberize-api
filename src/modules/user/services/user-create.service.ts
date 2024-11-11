import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRequest } from 'src/shared/types/user-request';
import { userCompanyValidator } from 'src/shared/validators/user-company.validator';
import { userRoleValidator } from 'src/shared/validators/user-role.validator';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserCreateService {
  constructor(private prisma: PrismaService) {}
  async execute(
    dto: UserCreateDto,
    userRequest: UserRequest,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
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

    if (user) throw new ConflictException('Usuário já cadastrado!');

    if (dto.roleId) await userRoleValidator(dto?.roleId, userRequest);

    if (dto.companyId) {
      await userCompanyValidator(dto?.companyId, userRequest);
    }

    const createdUser = await this.prisma.user.create({
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
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    return new UserEntity(createdUser);
  }
}
