import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenVerifyService } from '../services/token-verify.service';
import { ABILITIES_KEY } from '../decorators/require-abilities.decorator';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AbilityRequest } from '../types/ability-request';
import { UserRequest } from '../types/user-request';

import { IGNORE_ABILITIES_KEY } from '../decorators/ignore-abilities.decorator';

@Injectable()
export class UserAbilitiesGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private tokenVerifyService: TokenVerifyService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const ignoreAbilities = this.reflector.getAllAndOverride<boolean>(
      IGNORE_ABILITIES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    if (ignoreAbilities) return true;

    const abilities = this.reflector.getAllAndOverride<AbilityRequest>(
      ABILITIES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!abilities)
      throw new UnauthorizedException('Usuário sem habilidades necessárias!');

    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;

    const user: UserRequest = await this.tokenVerifyService.execute(token);

    if (!user) throw new UnauthorizedException('Usuário inválido!');

    const hasAbility = await this.prisma.roleAbility.findFirst({
      where: {
        roleId: user.roleId,
        ability: {
          code: abilities.code,
          action: abilities.action,
        },
      },
    });
    if (!hasAbility)
      throw new UnauthorizedException('Usuário sem habilidades necessárias!');

    return true;
  }
}
