import { IsEmail } from 'class-validator';

export class AuthRecoverPasswordDto {
  @IsEmail({}, { message: 'E-mail inválido!' })
  email: string;
}
