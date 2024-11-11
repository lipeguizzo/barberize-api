import {
  Body,
  Controller,
  Delete,
  Get,
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
import { HaircutCreateDto } from '../domain/dto/haircut-create.dto';
import { HaircutFindManyDto } from '../domain/dto/haircut-find-many.dto';
import { HaircutUpdateDto } from '../domain/dto/haircut-update.dto';
import { HaircutEntity } from '../domain/entities/haircut.entity';
import { HaircutCreateService } from '../services/haircut-create.service';
import { HaircutDeleteService } from '../services/haircut-delete.service';
import { HaircutFindManyService } from '../services/haircut-find-many.service';
import { HaircutFindOneService } from '../services/haircut-find-one.service';
import { HaircutUpdateService } from '../services/haircut-update.service';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Haircuts')
@Controller('haircuts')
export class HaircutController {
  constructor(
    private readonly haircutFindManyService: HaircutFindManyService,
    private readonly haircutFindOneService: HaircutFindOneService,
    private readonly haircutCreateService: HaircutCreateService,
    private readonly haircutUpdateService: HaircutUpdateService,
    private readonly haircutDeleteService: HaircutDeleteService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: HaircutFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<HaircutEntity>> {
    return await this.haircutFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.HAIRCUTS, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    return await this.haircutFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.HAIRCUTS, $Enums.AbilityActions.CREATE)
  async create(
    @Body() dto: HaircutCreateDto,
    @User() userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    return await this.haircutCreateService.execute(dto, userRequest);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.HAIRCUTS, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: HaircutUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    return await this.haircutUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @RequireAbilities($Enums.AbilityCodes.HAIRCUTS, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<HaircutEntity> {
    return await this.haircutDeleteService.execute(id, userRequest);
  }
}
