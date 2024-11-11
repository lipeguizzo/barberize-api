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
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { HistoryCreateDto } from '../domain/dto/history-create.dto';
import { HistoryFindManyDto } from '../domain/dto/history-find-many.dto';
import { HistoryUpdateDto } from '../domain/dto/history-update.dto';
import { HistoryEntity } from '../domain/entities/history.entity';
import { HistoryCreateService } from '../services/history-create.service';
import { HistoryDeleteService } from '../services/history-delete.service';
import { HistoryFindManyService } from '../services/history-find-many.service';
import { HistoryFindOneService } from '../services/history-find-one.service';
import { HistoryUpdateService } from '../services/history-update.service';

@ApiTags('Histories')
@Controller('histories')
export class HistoryController {
  constructor(
    private readonly historyFindManyService: HistoryFindManyService,
    private readonly historyFindOneService: HistoryFindOneService,
    private readonly historyCreateService: HistoryCreateService,
    private readonly historyUpdateService: HistoryUpdateService,
    private readonly historyDeleteService: HistoryDeleteService,
  ) {}

  @Get()
  @RequireAbilities($Enums.AbilityCodes.HISTORIES, $Enums.AbilityActions.READ)
  async findAll(
    @Query() params: HistoryFindManyDto,
  ): Promise<PaginationResponseDto<HistoryEntity>> {
    return await this.historyFindManyService.execute(params);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.HISTORIES, $Enums.AbilityActions.READ)
  async findOne(@Param('id') id: number): Promise<HistoryEntity> {
    return await this.historyFindOneService.execute(id);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.HISTORIES, $Enums.AbilityActions.CREATE)
  async create(@Body() dto: HistoryCreateDto): Promise<HistoryEntity> {
    return await this.historyCreateService.execute(dto);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.HISTORIES, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: HistoryUpdateDto,
  ): Promise<HistoryEntity> {
    return await this.historyUpdateService.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities($Enums.AbilityCodes.HISTORIES, $Enums.AbilityActions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    return await this.historyDeleteService.execute(id);
  }
}
