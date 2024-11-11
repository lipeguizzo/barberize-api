import { Module } from '@nestjs/common';
import { HoraryController } from './controllers/horary.controller';
import { HoraryFindManyService } from './services/horary-find-many.service';
import { HoraryFindOneService } from './services/horary-find-one.service';
import { HoraryCreateService } from './services/horary-create.service';
import { HoraryUpdateService } from './services/horary-update.service';
import { HoraryUpdateAvailableService } from './services/horary-update-available.service';
import { HoraryDeleteService } from './services/horary-delete.service';

@Module({
  controllers: [HoraryController],
  providers: [
    HoraryFindManyService,
    HoraryFindOneService,
    HoraryCreateService,
    HoraryUpdateService,
    HoraryUpdateAvailableService,
    HoraryDeleteService,
  ],
})
export class HoraryModule {}
