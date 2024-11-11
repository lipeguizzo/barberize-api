import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

@Injectable()
export class TokenSignService {
  constructor(private jwtService: JwtService) {}
  async execute(
    user: UserEntity,
    expires: string,
    secret?: string,
  ): Promise<string> {
    const token: string = await this.jwtService.signAsync(user, {
      expiresIn: expires,
      secret: secret ?? process.env.JWT_SECRET,
    });

    return token;
  }
}
