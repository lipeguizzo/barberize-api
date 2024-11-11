import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class StoredFileCreateDto {
  @IsString({ message: 'Nome inválido!' })
  name?: string;

  @IsString({ message: 'Caminho inválido!' })
  relativePath: string;

  @IsString({ message: 'Alternativo inválido!' })
  alt: string;

  @IsBoolean({ message: 'Valor público inválido!' })
  @IsDefined()
  @Transform(({ value }) => value == 'true')
  isPublic?: boolean = true;
}
