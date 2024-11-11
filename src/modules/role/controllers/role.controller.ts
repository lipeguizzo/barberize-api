import { $Enums } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleFindManyDto } from '../domain/dto/role-find-many.dto';
import { RoleFindManyService } from '../services/role-find-many.service';
import { RoleFindAbilitiesService } from '../services/role-find-abilities.service';
import { RoleFindOneService } from '../services/role-find-one.service';
import { RoleCreateService } from '../services/role-create.service';
import { RoleCreateDto } from '../domain/dto/role-create.dto';
import { RoleUpdateService } from '../services/role-update.service';
import { RoleUpdateDto } from '../domain/dto/role-update.dto';
import { RoleDeleteService } from '../services/role-delete.service';
import { RoleUpdateStatusDto } from '../domain/dto/role-update-status.dto';
import { RoleUpdateStatusService } from '../services/role-update-status.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { UserRequest } from 'src/shared/types/user-request';
import { RoleFindAllAbilitiesService } from '../services/role-find-all-abilities.service';
import { RequireAbilities } from 'src/shared/decorators/require-abilities.decorator';
import { RoleEntity } from '../domain/entities/role.entity';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { AbilityEntity } from '../domain/entities/ability.entity';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleFindManyService: RoleFindManyService,
    private readonly roleFindOneService: RoleFindOneService,
    private readonly roleFindAllAbilitiesService: RoleFindAllAbilitiesService,
    private readonly roleFindAbilitiesService: RoleFindAbilitiesService,
    private readonly roleCreateService: RoleCreateService,
    private readonly roleUpdateService: RoleUpdateService,
    private readonly roleUpdateStatusService: RoleUpdateStatusService,
    private readonly roleDeleteService: RoleDeleteService,
  ) {}

  @Get()
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.READ)
  async findAll(
    @Query() params: RoleFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<RoleEntity>> {
    return await this.roleFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<RoleEntity> {
    return await this.roleFindOneService.execute(id, userRequest);
  }

  @Get('all-abilities')
  @IgnoreAbilities()
  async findAllAbilities(): Promise<AbilityEntity[]> {
    return await this.roleFindAllAbilitiesService.execute();
  }

  @Get(':id/abilities')
  @IgnoreAbilities()
  async findAbilities(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<AbilityEntity[]> {
    return await this.roleFindAbilitiesService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.CREATE)
  async create(
    @Body() dto: RoleCreateDto,
    @User() userRequest: UserRequest,
  ): Promise<RoleEntity> {
    return await this.roleCreateService.execute(dto, userRequest);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: RoleUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<RoleEntity> {
    return await this.roleUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<RoleEntity> {
    return await this.roleDeleteService.execute(id, userRequest);
  }

  @Patch(':id/status')
  @RequireAbilities($Enums.AbilityCodes.ROLES, $Enums.AbilityActions.UPDATE)
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: RoleUpdateStatusDto,
    @User() userRequest: UserRequest,
  ): Promise<RoleEntity> {
    return await this.roleUpdateStatusService.execute(id, dto, userRequest);
  }
}
