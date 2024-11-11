import { Module } from '@nestjs/common';
import { WorkingDayController } from './controllers/working-day.controller';
import { WorkingDayCreateService } from './services/working-day-create.service';
import { WorkingDayDeleteService } from './services/working-day-delete.service';
import { WorkingDayFindManyService } from './services/working-day-find-many.service';
import { WorkingDayFindOneService } from './services/working-day-find-one.service';
import { WorkingDayUpdateOpenService } from './services/working-day-update-open.service';
import { WorkingDayUpdateService } from './services/working-day-update.service';

@Module({
  controllers: [WorkingDayController],
  providers: [
    WorkingDayFindManyService,
    WorkingDayFindOneService,
    WorkingDayCreateService,
    WorkingDayUpdateService,
    WorkingDayUpdateOpenService,
    WorkingDayDeleteService,
  ],
})
export class WorkingDayModule {}
