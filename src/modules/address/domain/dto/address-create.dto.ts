import { IsOptional, IsString } from 'class-validator';

export class AddressCreateDto {
  @IsString({ message: 'Estado inválido!' })
  state: string;

  @IsString({ message: 'Cidade inválida!' })
  city: string;

  @IsString({ message: 'Logradouro inválido!' })
  street: string;

  @IsString({ message: 'Bairro inválido!' })
  neighborhood: string;

  @IsString({ message: 'Complemento inválido!' })
  @IsOptional()
  complement?: string;
}
