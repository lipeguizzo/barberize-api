import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

@Injectable()
export class TokenVerifyService {
  constructor(private jwtService: JwtService) {}
  async execute(token: string, secret?: string): Promise<UserEntity> {
    try {
      const payload: UserEntity = await this.jwtService.verifyAsync(token, {
        secret: secret ?? process.env.JWT_SECRET,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido!');
    }
  }
}
