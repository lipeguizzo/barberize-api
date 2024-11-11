import { Module } from '@nestjs/common';
import { HistoryController } from './controllers/history.controller';
import { HistoryFindManyService } from './services/history-find-many.service';
import { HistoryFindOneService } from './services/history-find-one.service';
import { HistoryCreateService } from './services/history-create.service';
import { HistoryUpdateService } from './services/history-update.service';
import { HistoryDeleteService } from './services/history-delete.service';

@Module({
  controllers: [HistoryController],
  providers: [
    HistoryFindManyService,
    HistoryFindOneService,
    HistoryCreateService,
    HistoryUpdateService,
    HistoryDeleteService,
  ],
})
export class HistoryModule {}
