import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { TokenVerifyService } from 'src/shared/services/token-verify.service';
import { AuthResetPasswordDto } from '../domain/dto/auth-reset-password.dto';

@Injectable()
export class AuthResetPasswordService {
  constructor(
    private prisma: PrismaService,
    private tokenVerifyService: TokenVerifyService,
  ) {}
  async execute(dto: AuthResetPasswordDto): Promise<UserEntity> {
    const user = await this.tokenVerifyService.execute(dto.token);

    if (!user) throw new UnauthorizedException('Token inválido!');

    const updatedUser = await this.prisma.user.update({
      data: {
        password: await hash(dto.password, 10),
      },
      where: { id: user.id },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    return new UserEntity(updatedUser);
  }
}
