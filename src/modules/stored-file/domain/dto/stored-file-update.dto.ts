import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class StoredFileUpdateDto {
  @IsString({ message: 'Nome inválido!' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Caminho inválido!' })
  @IsOptional()
  relativePath?: string;

  @IsString({ message: 'Caminho inválido!' })
  @IsOptional()
  alt?: string;

  @IsBoolean({ message: 'Valor público inválido!' })
  @IsOptional()
  @Transform(({ value }) => value == 'true')
  isPublic?: boolean;
}
