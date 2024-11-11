import { Module } from '@nestjs/common';
import { HolidayController } from './controllers/holiday.controller';
import { HolidayFindManyService } from './services/holiday-find-many.service';
import { HolidayFindOneService } from './services/holiday-find-one.service';
import { HolidayCreateService } from './services/holiday-create.service';
import { HolidayUpdateService } from './services/holiday-update.service';
import { HolidayDeleteService } from './services/holiday-delete.service';

@Module({
  controllers: [HolidayController],
  providers: [
    HolidayFindManyService,
    HolidayFindOneService,
    HolidayCreateService,
    HolidayUpdateService,
    HolidayDeleteService,
  ],
})
export class HolidayModule {}
