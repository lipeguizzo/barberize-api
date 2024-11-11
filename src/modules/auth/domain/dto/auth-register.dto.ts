import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressCreateDto } from 'src/modules/address/domain/dto/address-create.dto';
import { IsPassword } from 'src/shared/decorators/is-password.decorator';

export class AuthRegisterDto {
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

  @IsEnum($Enums.RoleReferences, { message: 'Referência inválida!' })
  reference: $Enums.RoleReferences;

  @IsString({ message: 'Nome de empresa inválido!' })
  @IsOptional()
  companyName?: string;

  @IsString({ message: 'Nome fantasia de empresa inválido!' })
  @IsOptional()
  companyTradeName?: string;

  @IsEmail({}, { message: 'E-mail de empresa inválido!' })
  @IsOptional()
  companyEmail?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  address?: AddressCreateDto;
}
