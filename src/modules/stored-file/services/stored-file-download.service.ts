import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { IFileAdapter } from '../../../infra/file-system/domain/interfaces/file-adapter.interface';
import { AwsFileSystem } from '../../../infra/file-system/storage/aws.file-system';

@Injectable()
export class StoredFileDownloadService {
  constructor(
    private prisma: PrismaService,
    private awsFileSystem: AwsFileSystem,
  ) {}
  async execute(uuid: string, isPublic?: boolean): Promise<IFileAdapter> {
    const storedFile = await this.prisma.storedFile.findUnique({
      where: { uuid: uuid, isPublic: isPublic },
    });

    if (!storedFile) throw new NotFoundException('Arquivo não encontrado!');

    return await this.awsFileSystem.get(
      storedFile.relativePath,
      storedFile.storedName,
    );
  }
}
