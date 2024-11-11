import { Module } from '@nestjs/common';
import { AssessmentController } from './controllers/assessment.controller';
import { AssessmentCreateService } from './services/assessment-create.service';
import { AssessmentDeleteService } from './services/assessment-delete.service';
import { AssessmentFindManyService } from './services/assessment-find-many.service';
import { AssessmentFindOneService } from './services/assessment-find-one.service';
import { AssessmentUpdateService } from './services/assessment-update.service';
import { AssessmentFindBarberNoteService } from './services/assessment-find-barber-note.service';
import { AssessmentFindCompanyNoteService } from './services/assessment-find-company-note.service';

@Module({
  controllers: [AssessmentController],
  providers: [
    AssessmentFindManyService,
    AssessmentFindOneService,
    AssessmentFindBarberNoteService,
    AssessmentFindCompanyNoteService,
    AssessmentCreateService,
    AssessmentUpdateService,
    AssessmentDeleteService,
  ],
})
export class AssessmentModule {}
