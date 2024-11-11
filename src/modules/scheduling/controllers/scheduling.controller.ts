import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { SchedulingCreateDto } from '../domain/dto/scheduling-create.dto';
import { SchedulingFindManyDto } from '../domain/dto/scheduling-find-many.dto';
import { SchedulingUpdateStatusDto } from '../domain/dto/scheduling-update-status.dto';
import { SchedulingUpdateDto } from '../domain/dto/scheduling-update.dto';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import { SchedulingCreateService } from '../services/scheduling-create.service';
import { SchedulingDeleteService } from '../services/scheduling-delete.service';
import { SchedulingFindManyService } from '../services/scheduling-find-many.service';
import { SchedulingFindOneService } from '../services/scheduling-find-one.service';
import { SchedulingUpdateStatusService } from '../services/scheduling-update-status.service';
import { SchedulingUpdateService } from '../services/scheduling-update.service';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';
import { SchedulingFindHoursService } from '../services/scheduling-find-hours.service';
import { SchedulingFindHoursDto } from '../domain/dto/scheduling-find-hours.dto';
import { HoraryEntity } from 'src/modules/horary/domain/entities/horary.entity';
import { SchedulingFindUnavailableDaysDto } from '../domain/dto/scheduling-find-unavailable-days.dto';
import { SchedulingFindUnavailableDaysService } from '../services/scheduling-find-unavailable-days.service';
import { SchedulingFindUnavailableDaysResponseDto } from '../domain/dto/scheduling-find-unavailable-days-response.dto';

@ApiTags('Schedulings')
@Controller('schedulings')
export class SchedulingController {
  constructor(
    private readonly schedulingFindManyService: SchedulingFindManyService,
    private readonly schedulingFindOneService: SchedulingFindOneService,
    private readonly schedulingFindHoursService: SchedulingFindHoursService,
    private readonly schedulingFindUnavailableDaysService: SchedulingFindUnavailableDaysService,
    private readonly schedulingCreateService: SchedulingCreateService,
    private readonly schedulingUpdateService: SchedulingUpdateService,
    private readonly schedulingUpdateStatusService: SchedulingUpdateStatusService,
    private readonly schedulingDeleteService: SchedulingDeleteService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: SchedulingFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<SchedulingEntity>> {
    return await this.schedulingFindManyService.execute(params, userRequest);
  }

  @Get('hours')
  @IgnoreAbilities()
  async findHours(
    @Query() params: SchedulingFindHoursDto,
  ): Promise<HoraryEntity[]> {
    return await this.schedulingFindHoursService.execute(params);
  }

  @Get('unavailable-days')
  @IgnoreAbilities()
  async findUnavailableDays(
    @Query() params: SchedulingFindUnavailableDaysDto,
  ): Promise<SchedulingFindUnavailableDaysResponseDto[]> {
    return await this.schedulingFindUnavailableDaysService.execute(params);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.SCHEDULINGS, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    return await this.schedulingFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities(
    $Enums.AbilityCodes.SCHEDULINGS,
    $Enums.AbilityActions.CREATE,
  )
  async create(@Body() dto: SchedulingCreateDto): Promise<SchedulingEntity> {
    return await this.schedulingCreateService.execute(dto);
  }

  @Put(':id')
  @RequireAbilities(
    $Enums.AbilityCodes.SCHEDULINGS,
    $Enums.AbilityActions.UPDATE,
  )
  async update(
    @Param('id') id: number,
    @Body() dto: SchedulingUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    return await this.schedulingUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities(
    $Enums.AbilityCodes.SCHEDULINGS,
    $Enums.AbilityActions.DELETE,
  )
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<void> {
    return await this.schedulingDeleteService.execute(id, userRequest);
  }

  @Patch(':id/status')
  @RequireAbilities(
    $Enums.AbilityCodes.SCHEDULINGS,
    $Enums.AbilityActions.UPDATE,
  )
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: SchedulingUpdateStatusDto,
    @User() userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    return await this.schedulingUpdateStatusService.execute(
      id,
      dto,
      userRequest,
    );
  }
}
