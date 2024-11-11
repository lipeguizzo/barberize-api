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
import { HoraryCreateDto } from '../domain/dto/horary-create.dto';
import { HoraryFindManyDto } from '../domain/dto/horary-find-many.dto';
import { HoraryUpdateAvailableDto } from '../domain/dto/horary-update-available.dto';
import { HoraryUpdateDto } from '../domain/dto/horary-update.dto';
import { HoraryEntity } from '../domain/entities/horary.entity';
import { HoraryCreateService } from '../services/horary-create.service';
import { HoraryDeleteService } from '../services/horary-delete.service';
import { HoraryFindManyService } from '../services/horary-find-many.service';
import { HoraryFindOneService } from '../services/horary-find-one.service';
import { HoraryUpdateAvailableService } from '../services/horary-update-available.service';
import { HoraryUpdateService } from '../services/horary-update.service';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Hours')
@Controller('hours')
export class HoraryController {
  constructor(
    private readonly horaryFindManyService: HoraryFindManyService,
    private readonly horaryFindOneService: HoraryFindOneService,
    private readonly horaryCreateService: HoraryCreateService,
    private readonly horaryUpdateService: HoraryUpdateService,
    private readonly horaryUpdateAvailableService: HoraryUpdateAvailableService,
    private readonly horaryDeleteService: HoraryDeleteService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: HoraryFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HoraryEntity>> {
    return await this.horaryFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @IgnoreAbilities()
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    return await this.horaryFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.HOURS, $Enums.AbilityActions.CREATE)
  async create(
    @Body() dto: HoraryCreateDto,
    @User() userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    return await this.horaryCreateService.execute(dto, userRequest);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.HOURS, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: HoraryUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    return await this.horaryUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities($Enums.AbilityCodes.HOURS, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<void> {
    return await this.horaryDeleteService.execute(id, userRequest);
  }

  @Patch(':id/available')
  @RequireAbilities($Enums.AbilityCodes.HOURS, $Enums.AbilityActions.UPDATE)
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: HoraryUpdateAvailableDto,
    @User() userRequest: UserRequest,
  ): Promise<HoraryEntity> {
    return await this.horaryUpdateAvailableService.execute(
      id,
      dto,
      userRequest,
    );
  }
}
