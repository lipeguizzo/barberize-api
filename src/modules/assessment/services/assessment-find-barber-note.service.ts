import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AssessmentFindNoteResponseDto } from '../domain/dto/assessment-find-note-response.dto';
import { assessmentNote } from '../helpers/assessment-note.helper';

@Injectable()
export class AssessmentFindBarberNoteService {
  constructor(private prisma: PrismaService) {}
  async execute(barberId: number): Promise<AssessmentFindNoteResponseDto> {
    const assessments = await this.prisma.assessment.findMany({
      where: {
        barberId: barberId,
      },
    });

    if (!assessments) throw new NotFoundException('Avaliação não encontrada!');

    const notes: number[] = assessments.map((assessment) => assessment.score);
    const barberNote: number = assessmentNote(notes);

    return { note: barberNote };
  }
}
