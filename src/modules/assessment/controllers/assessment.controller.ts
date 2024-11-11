import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { RequireAbilities } from 'src/shared/decorators/require-abilities.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { AssessmentCreateDto } from '../domain/dto/assessment-create.dto';
import { AssessmentFindManyDto } from '../domain/dto/assessment-find-many.dto';
import { AssessmentUpdateDto } from '../domain/dto/assessment-update.dto';
import { AssessmentEntity } from '../domain/entities/assessment.entity';
import { AssessmentCreateService } from '../services/assessment-create.service';
import { AssessmentDeleteService } from '../services/assessment-delete.service';
import { AssessmentFindManyService } from '../services/assessment-find-many.service';
import { AssessmentFindOneService } from '../services/assessment-find-one.service';
import { AssessmentUpdateService } from '../services/assessment-update.service';
import { AssessmentFindNoteResponseDto } from '../domain/dto/assessment-find-note-response.dto';
import { AssessmentFindBarberNoteService } from '../services/assessment-find-barber-note.service';
import { AssessmentFindCompanyNoteService } from '../services/assessment-find-company-note.service';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(
    private readonly assessmentFindManyService: AssessmentFindManyService,
    private readonly assessmentFindOneService: AssessmentFindOneService,
    private readonly assessmentFindBarberNoteService: AssessmentFindBarberNoteService,
    private readonly assessmentFindCompanyNoteService: AssessmentFindCompanyNoteService,
    private readonly assessmentCreateService: AssessmentCreateService,
    private readonly assessmentUpdateService: AssessmentUpdateService,
    private readonly assessmentDeleteService: AssessmentDeleteService,
  ) {}

  @Get()
  @RequireAbilities($Enums.AbilityCodes.ASSESSMENTS, $Enums.AbilityActions.READ)
  async findAll(
    @Query() params: AssessmentFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<AssessmentEntity>> {
    return await this.assessmentFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.ASSESSMENTS, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<AssessmentEntity> {
    return await this.assessmentFindOneService.execute(id, userRequest);
  }

  @Get('barber/:barberId/note')
  @RequireAbilities($Enums.AbilityCodes.ASSESSMENTS, $Enums.AbilityActions.READ)
  async findBarberNote(
    @Param('barberId') barberId: number,
  ): Promise<AssessmentFindNoteResponseDto> {
    return await this.assessmentFindBarberNoteService.execute(barberId);
  }

  @Get('company/:companyId/note')
  @RequireAbilities($Enums.AbilityCodes.ASSESSMENTS, $Enums.AbilityActions.READ)
  async findCompanyNote(
    @Param('companyId') companyId: number,
  ): Promise<AssessmentFindNoteResponseDto> {
    return await this.assessmentFindCompanyNoteService.execute(companyId);
  }

  @Post()
  @RequireAbilities(
    $Enums.AbilityCodes.ASSESSMENTS,
    $Enums.AbilityActions.CREATE,
  )
  async create(@Body() dto: AssessmentCreateDto): Promise<AssessmentEntity> {
    return await this.assessmentCreateService.execute(dto);
  }

  @Put(':id')
  @RequireAbilities(
    $Enums.AbilityCodes.ASSESSMENTS,
    $Enums.AbilityActions.UPDATE,
  )
  async update(
    @Param('id') id: number,
    @Body() dto: AssessmentUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<AssessmentEntity> {
    return await this.assessmentUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities(
    $Enums.AbilityCodes.ASSESSMENTS,
    $Enums.AbilityActions.DELETE,
  )
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<void> {
    return await this.assessmentDeleteService.execute(id, userRequest);
  }
}
