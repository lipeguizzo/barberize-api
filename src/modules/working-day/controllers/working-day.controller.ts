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
import { WorkingDayUpdateOpenService } from '../services/working-day-update-open.service';
import { WorkingDayDeleteService } from '../services/working-day-delete.service';
import { WorkingDayUpdateService } from '../services/working-day-update.service';
import { WorkingDayCreateService } from '../services/working-day-create.service';
import { WorkingDayFindOneService } from '../services/working-day-find-one.service';
import { WorkingDayFindManyService } from '../services/working-day-find-many.service';
import { WorkingDayFindManyDto } from '../domain/dto/working-day-find-many.dto';
import { WorkingDayEntity } from '../domain/entities/working-day.entity';
import { WorkingDayCreateDto } from '../domain/dto/working-day-create.dto';
import { WorkingDayUpdateDto } from '../domain/dto/working-day-update.dto';
import { WorkingDayUpdateOpenDto } from '../domain/dto/working-day-update-open.dto';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Working Days')
@Controller('working-days')
export class WorkingDayController {
  constructor(
    private readonly workingDayFindManyService: WorkingDayFindManyService,
    private readonly workingDayFindOneService: WorkingDayFindOneService,
    private readonly workingDayCreateService: WorkingDayCreateService,
    private readonly workingDayUpdateService: WorkingDayUpdateService,
    private readonly workingDayUpdateOpenService: WorkingDayUpdateOpenService,
    private readonly workingDayDeleteService: WorkingDayDeleteService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: WorkingDayFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<WorkingDayEntity>> {
    return await this.workingDayFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @RequireAbilities(
    $Enums.AbilityCodes.WORKING_DAYS,
    $Enums.AbilityActions.READ,
  )
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    return await this.workingDayFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities(
    $Enums.AbilityCodes.WORKING_DAYS,
    $Enums.AbilityActions.CREATE,
  )
  async create(
    @Body() dto: WorkingDayCreateDto,
    @User() userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    return await this.workingDayCreateService.execute(dto, userRequest);
  }

  @Put(':id')
  @RequireAbilities(
    $Enums.AbilityCodes.WORKING_DAYS,
    $Enums.AbilityActions.UPDATE,
  )
  async update(
    @Param('id') id: number,
    @Body() dto: WorkingDayUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    return await this.workingDayUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities(
    $Enums.AbilityCodes.WORKING_DAYS,
    $Enums.AbilityActions.DELETE,
  )
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<void> {
    return await this.workingDayDeleteService.execute(id, userRequest);
  }

  @Patch(':id/open')
  @RequireAbilities(
    $Enums.AbilityCodes.WORKING_DAYS,
    $Enums.AbilityActions.UPDATE,
  )
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: WorkingDayUpdateOpenDto,
    @User() userRequest: UserRequest,
  ): Promise<WorkingDayEntity> {
    return await this.workingDayUpdateOpenService.execute(id, dto, userRequest);
  }
}
