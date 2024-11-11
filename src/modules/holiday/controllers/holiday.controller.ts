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
import { HolidayFindManyService } from '../services/holiday-find-many.service';
import { HolidayFindOneService } from '../services/holiday-find-one.service';
import { HolidayCreateService } from '../services/holiday-create.service';
import { HolidayUpdateService } from '../services/holiday-update.service';
import { HolidayDeleteService } from '../services/holiday-delete.service';
import { HolidayFindManyDto } from '../domain/dto/holiday-find-many.dto';
import { HolidayEntity } from '../domain/entities/holiday.entity';
import { HolidayCreateDto } from '../domain/dto/holiday-create.dto';
import { HolidayUpdateDto } from '../domain/dto/holiday-update.dto';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Holidays')
@Controller('holidays')
export class HolidayController {
  constructor(
    private readonly holidayFindManyService: HolidayFindManyService,
    private readonly holidayFindOneService: HolidayFindOneService,
    private readonly holidayCreateService: HolidayCreateService,
    private readonly holidayUpdateService: HolidayUpdateService,
    private readonly holidayDeleteService: HolidayDeleteService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: HolidayFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HolidayEntity>> {
    return await this.holidayFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.HOLIDAYS, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<HolidayEntity> {
    return await this.holidayFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.HOLIDAYS, $Enums.AbilityActions.CREATE)
  async create(@Body() dto: HolidayCreateDto): Promise<HolidayEntity> {
    return await this.holidayCreateService.execute(dto);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.HOLIDAYS, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: HolidayUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<HolidayEntity> {
    return await this.holidayUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireAbilities($Enums.AbilityCodes.HOLIDAYS, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<void> {
    return await this.holidayDeleteService.execute(id, userRequest);
  }
}
