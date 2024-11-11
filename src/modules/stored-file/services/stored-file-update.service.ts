import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { IFileAdapter } from '../../../infra/file-system/domain/interfaces/file-adapter.interface';
import { AwsFileSystem } from '../../../infra/file-system/storage/aws.file-system';
import { generateFileName } from '../../../shared/utils/file';
import { hashMd5 } from '../../../shared/utils/hash';
import { StoredFileUpdateDto } from '../domain/dto/stored-file-update.dto';
import { StoredFileEntity } from '../domain/entities/stored-file.entity';

@Injectable()
export class StoredFileUpdateService {
  constructor(
    private prisma: PrismaService,
    private awsFileSystem: AwsFileSystem,
  ) {}
  async execute(
    uuid: string,
    file: IFileAdapter,
    dto: StoredFileUpdateDto,
  ): Promise<StoredFileEntity> {
    const storedFile = await this.prisma.storedFile.findUnique({
      where: { uuid: uuid },
    });

    if (!storedFile) throw new NotFoundException('Arquivo não encontrado!');

    const storedName = generateFileName(dto.name ?? file.name);

    await this.awsFileSystem.delete(
      `${storedFile.relativePath}/${storedFile.storedName}`,
    );

    await this.awsFileSystem.put({
      name: storedName,
      relativePath: dto.relativePath ?? storedFile.relativePath,
      content: file.content,
      length: file.length,
      contentType: file.contentType,
    });

    const updatedStoredFile = await this.prisma.storedFile.update({
      where: { uuid: uuid },
      data: {
        alt: dto.alt,
        checksum: await hashMd5(file.content),
        originalName: file.name,
        storedName: storedName,
        relativePath: dto.relativePath,
        contentType: file.contentType,
        isPublic: dto.isPublic,
      },
    });

    return new StoredFileEntity(updatedStoredFile);
  }
}
