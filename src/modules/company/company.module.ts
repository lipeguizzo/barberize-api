import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CompanyFindManyService } from './services/company-find-many.service';
import { CompanyFindOneService } from './services/company-find-one.service';
import { CompanyCreateService } from './services/company-create.service';
import { CompanyUpdateService } from './services/company-update.service';
import { CompanyUpdateStatusService } from './services/company-update-status.service';
import { CompanyDeleteService } from './services/company-delete.service';

import { WorkingDayCreateDefaultService } from '../working-day/services/working-day-create-default.service';
import { HolidayCreateDefaultService } from '../holiday/services/holiday-create-default.service';
import { CompanyFindNameService } from './services/company-find-name.service';
import { CompanyUpdateAvatarService } from './services/company-update-avatar.service';
import { CompanyDeleteAvatarService } from './services/company-delete-avatar.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyFindManyService,
    CompanyFindNameService,
    CompanyFindOneService,
    CompanyCreateService,
    CompanyUpdateService,
    CompanyUpdateStatusService,
    CompanyUpdateAvatarService,
    CompanyDeleteAvatarService,
    CompanyDeleteService,
    WorkingDayCreateDefaultService,
    HolidayCreateDefaultService,
  ],
})
export class CompanyModule {}
