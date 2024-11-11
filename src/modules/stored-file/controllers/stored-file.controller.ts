import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IFileAdapter } from 'src/infra/file-system/domain/interfaces/file-adapter.interface';
import { Public } from 'src/shared/decorators/public.decorator';
import { Readable } from 'stream';
import { StoredFileDownloadService } from '../services/stored-file-download.service';

@ApiTags('Files')
@Controller('files')
export class StoredFileController {
  constructor(
    private readonly storedFileDownloadService: StoredFileDownloadService,
  ) {}

  @Get(':uuid')
  @Public()
  async download(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const file: IFileAdapter =
      await this.storedFileDownloadService.execute(uuid);
    response.set({
      'Content-Type': file.contentType,
      'Content-Length': file.length,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    return new StreamableFile(file.content as Readable, {
      length: file.length,
      type: file.contentType,
    });
  }

  @Get('public/:uuid')
  @Public()
  async downloadPublic(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const file: IFileAdapter = await this.storedFileDownloadService.execute(
      uuid,
      true,
    );
    response.set({
      'Content-Type': file.contentType,
      'Content-Length': file.length,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    return new StreamableFile(file.content as Readable, {
      length: file.length,
      type: file.contentType,
    });
  }
}
