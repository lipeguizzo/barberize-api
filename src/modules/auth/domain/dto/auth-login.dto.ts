import { IsEmail } from 'class-validator';
import { IsPassword } from 'src/shared/decorators/is-password.decorator';

export class AuthLoginDto {
  @IsEmail({}, { message: 'E-mail inválido!' })
  email: string;

  @IsPassword()
  password: string;
}
