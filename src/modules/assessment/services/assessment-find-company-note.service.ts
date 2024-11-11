import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AssessmentFindNoteResponseDto } from '../domain/dto/assessment-find-note-response.dto';
import { assessmentNote } from '../helpers/assessment-note.helper';

@Injectable()
export class AssessmentFindCompanyNoteService {
  constructor(private prisma: PrismaService) {}
  async execute(companyId: number): Promise<AssessmentFindNoteResponseDto> {
    const assessments = await this.prisma.assessment.findMany({
      where: {
        companyId: companyId,
      },
    });

    if (!assessments) throw new NotFoundException('Avaliação não encontrada!');

    const notes: number[] = assessments.map((assessment) => assessment.score);
    const companyNote: number = assessmentNote(notes);

    return { note: companyNote };
  }
}
