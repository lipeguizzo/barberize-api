import { IsString } from 'class-validator';
import { IsPassword } from 'src/shared/decorators/is-password.decorator';

export class AuthResetPasswordDto {
  @IsPassword()
  password: string;

  @IsString({ message: 'Token inválido!' })
  token: string;
}
