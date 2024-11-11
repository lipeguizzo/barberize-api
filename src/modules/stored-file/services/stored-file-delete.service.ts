import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AwsFileSystem } from '../../../infra/file-system/storage/aws.file-system';

@Injectable()
export class StoredFileDeleteService {
  constructor(
    private prisma: PrismaService,
    private awsFileSystem: AwsFileSystem,
  ) {}
  async execute(uuid: string): Promise<void> {
    const storedFile = await this.prisma.storedFile.findUnique({
      where: { uuid },
    });

    if (!storedFile) throw new NotFoundException('Arquivo não encontrado!');

    await this.awsFileSystem.delete(
      `${storedFile.relativePath}/${storedFile.storedName}`,
    );

    await this.prisma.storedFile.delete({ where: { uuid } });
  }
}
