import { $Enums } from '@prisma/client';
import { IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator';
import { AddressCreateDto } from 'src/modules/address/domain/dto/address-create.dto';

export class CompanyCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name: string;

  @IsString({ message: 'Nome fantasia inválido!' })
  tradeName: string;

  @IsEmail({}, { message: 'E-mail inválido!' })
  email: string;

  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;

  @ValidateNested({ each: true })
  address: AddressCreateDto;
}
