import { Module } from '@nestjs/common';
import { SchedulingController } from './controllers/scheduling.controller';
import { SchedulingCreateService } from './services/scheduling-create.service';
import { SchedulingDeleteService } from './services/scheduling-delete.service';
import { SchedulingFindHoursService } from './services/scheduling-find-hours.service';
import { SchedulingFindManyService } from './services/scheduling-find-many.service';
import { SchedulingFindOneService } from './services/scheduling-find-one.service';
import { SchedulingFindUnavailableDaysService } from './services/scheduling-find-unavailable-days.service';
import { SchedulingNotificationService } from './services/scheduling-notification.service';
import { SchedulingUpdateStatusService } from './services/scheduling-update-status.service';
import { SchedulingUpdateService } from './services/scheduling-update.service';

@Module({
  controllers: [SchedulingController],
  providers: [
    SchedulingFindManyService,
    SchedulingFindOneService,
    SchedulingFindHoursService,
    SchedulingFindUnavailableDaysService,
    SchedulingCreateService,
    SchedulingUpdateService,
    SchedulingUpdateStatusService,
    SchedulingDeleteService,
    SchedulingNotificationService,
  ],
})
export class SchedulingModule {}
