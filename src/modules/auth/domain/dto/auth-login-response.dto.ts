import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class AuthLoginResponseDto {
  user: UserEntity;

  token: string;

  refreshToken: string;
}
