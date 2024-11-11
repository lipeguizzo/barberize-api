import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { TokenSignService } from 'src/shared/services/token-sign.service';
import { AuthLoginResponseDto } from '../domain/dto/auth-login-response.dto';
import { AuthLoginDto } from '../domain/dto/auth-login.dto';

@Injectable()
export class AuthLoginService {
  constructor(
    private prisma: PrismaService,
    private tokenSignService: TokenSignService,
  ) {}
  async execute(dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        deletedAt: null,
      },
      include: {
        role: true,
        company: true,
        avatar: true,
      },
    });

    if (!user) throw new NotFoundException('E-mail incorreto!');

    if (user.status === $Enums.Status.WAITING)
      throw new UnauthorizedException('Usuário aguardando aprovação!');

    if (user.status === $Enums.Status.BLOCKED)
      throw new UnauthorizedException('Usuário bloqueado!');

    if (user.status === $Enums.Status.DISABLED)
      throw new UnauthorizedException('Usuário desabilitado!');

    const passwordsMatched = await compare(dto.password, user.password);

    if (!passwordsMatched) throw new ConflictException('Senha incorreta!');

    return {
      user: new UserEntity(user),
      token: await this.tokenSignService.execute(user, '10m'),
      refreshToken: await this.tokenSignService.execute(
        user,
        '10d',
        process.env.JWT_REFRESH_SECRET,
      ),
    };
  }
}
