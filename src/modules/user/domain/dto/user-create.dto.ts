import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsPassword } from 'src/shared/decorators/is-password.decorator';

export class UserCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido!' })
  email: string;

  @IsPassword()
  password: string;

  @IsEnum($Enums.Gender, { message: 'Gênero inválido!' })
  gender: $Enums.Gender;

  @IsString({ message: 'Telefone inválido!' })
  phone: string;

  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  companyId?: number;

  @IsNumber({}, { message: 'Perfil inválido!' })
  roleId: number;
}
