import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class AuthRefreshResponseDto {
  user: UserEntity;

  token: string;

  refreshToken: string;
}
