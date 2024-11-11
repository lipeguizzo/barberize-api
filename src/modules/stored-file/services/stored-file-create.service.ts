import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '../../../infra/file-system/domain/interfaces/file-adapter.interface';
import { AwsFileSystem } from '../../../infra/file-system/storage/aws.file-system';
import { generateFileName } from '../../../shared/utils/file';
import { hashMd5 } from '../../../shared/utils/hash';
import { StoredFileCreateDto } from '../domain/dto/stored-file-create.dto';
import { StoredFileEntity } from '../domain/entities/stored-file.entity';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class StoredFileCreateService {
  constructor(
    private prisma: PrismaService,
    private awsFileSystem: AwsFileSystem,
  ) {}
  async execute(
    file: IFileAdapter,
    dto: StoredFileCreateDto,
  ): Promise<StoredFileEntity> {
    const storedName = generateFileName(dto.name ?? file.name);

    await this.awsFileSystem.put({
      name: storedName,
      relativePath: dto.relativePath,
      content: file.content,
      length: file.length,
      contentType: file.contentType,
    });

    const createdFile = await this.prisma.storedFile.create({
      data: {
        alt: dto.alt,
        checksum: await hashMd5(file?.content),
        originalName: file.name,
        storedName: storedName,
        relativePath: dto.relativePath,
        contentType: file.contentType,
        isPublic: dto.isPublic,
      },
    });

    return new StoredFileEntity(createdFile);
  }
}
