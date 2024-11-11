import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenVerifyService } from '../services/token-verify.service';
import { UserRequest } from '../types/user-request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenVerifyService: TokenVerifyService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;

    const user: UserRequest = await this.tokenVerifyService.execute(token);

    if (!user) throw new UnauthorizedException('Usuário inválido!');

    request.user = user;

    return true;
  }
}
