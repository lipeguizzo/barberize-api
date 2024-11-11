import { $Enums } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RoleCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name: string;

  @IsBoolean({ message: 'Valor padrão inválido!' })
  @IsDefined()
  isDefault: boolean = false;

  @IsEnum($Enums.RoleReferences, { message: 'Referência inválida!' })
  reference: $Enums.RoleReferences;

  @IsNumber({}, { message: 'Empresa inválida!' })
  @IsOptional()
  companyId?: number;

  @IsEnum($Enums.Status, { message: 'Status inválido!' })
  status: $Enums.Status;

  @IsArray({ message: 'Habilidades inválida!' })
  abilitiesIds: number[];
}
