import { Module } from '@nestjs/common';
import { HaircutController } from './controllers/haircut.controller';
import { HaircutFindManyService } from './services/haircut-find-many.service';
import { HaircutFindOneService } from './services/haircut-find-one.service';
import { HaircutCreateService } from './services/haircut-create.service';
import { HaircutUpdateService } from './services/haircut-update.service';
import { HaircutDeleteService } from './services/haircut-delete.service';

@Module({
  controllers: [HaircutController],
  providers: [
    HaircutFindManyService,
    HaircutFindOneService,
    HaircutCreateService,
    HaircutUpdateService,
    HaircutDeleteService,
  ],
})
export class HaircutModule {}
