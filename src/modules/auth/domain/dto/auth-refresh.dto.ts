import { IsString } from 'class-validator';

export class AuthRefreshDto {
  @IsString({ message: 'Refresh token inválido!' })
  refreshToken: string;
}
