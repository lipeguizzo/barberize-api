import { Global, Module } from '@nestjs/common';
import { StoredFileController } from './controllers/stored-file.controller';
import { StoredFileCreateService } from './services/stored-file-create.service';
import { StoredFileDeleteService } from './services/stored-file-delete.service';
import { StoredFileDownloadService } from './services/stored-file-download.service';
import { StoredFileUpdateService } from './services/stored-file-update.service';

@Global()
@Module({
  controllers: [StoredFileController],
  providers: [
    StoredFileCreateService,
    StoredFileDeleteService,
    StoredFileDownloadService,
    StoredFileUpdateService,
  ],
  exports: [
    StoredFileCreateService,
    StoredFileDownloadService,
    StoredFileUpdateService,
    StoredFileDeleteService,
  ],
})
export class StoredFileModule {}
