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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';
import { RequireAbilities } from 'src/shared/decorators/require-abilities.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserRequest } from 'src/shared/types/user-request';
import { CompanyCreateDto } from '../domain/dto/company-create.dto';
import { CompanyFindManyDto } from '../domain/dto/company-find-many.dto';
import { CompanyUpdateStatusDto } from '../domain/dto/company-update-status.dto';
import { CompanyUpdateDto } from '../domain/dto/company-update.dto';
import { CompanyEntity } from '../domain/entities/company.entity';
import { CompanyCreateService } from '../services/company-create.service';
import { CompanyDeleteAvatarService } from '../services/company-delete-avatar.service';
import { CompanyDeleteService } from '../services/company-delete.service';
import { CompanyFindManyService } from '../services/company-find-many.service';
import { CompanyFindNameService } from '../services/company-find-name.service';
import { CompanyFindOneService } from '../services/company-find-one.service';
import { CompanyUpdateAvatarService } from '../services/company-update-avatar.service';
import { CompanyUpdateStatusService } from '../services/company-update-status.service';
import { CompanyUpdateService } from '../services/company-update.service';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyFindManyService: CompanyFindManyService,
    private readonly companyFindNameService: CompanyFindNameService,
    private readonly companyFindOneService: CompanyFindOneService,
    private readonly companyCreateService: CompanyCreateService,
    private readonly companyUpdateService: CompanyUpdateService,
    private readonly companyUpdateStatusService: CompanyUpdateStatusService,
    private readonly companyDeleteService: CompanyDeleteService,
    private readonly companyUpdateAvatarService: CompanyUpdateAvatarService,
    private readonly companyDeleteAvatarService: CompanyDeleteAvatarService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: CompanyFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<CompanyEntity>> {
    return await this.companyFindManyService.execute(params, userRequest);
  }

  @Get(':id')
  @IgnoreAbilities()
  async findOne(@Param('id') id: number): Promise<CompanyEntity> {
    return await this.companyFindOneService.execute(id);
  }

  @Get('name/:name')
  @IgnoreAbilities()
  async findName(@Param('name') name: string): Promise<CompanyEntity> {
    return await this.companyFindNameService.execute(name);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.CREATE)
  async create(@Body() dto: CompanyCreateDto): Promise<CompanyEntity> {
    return await this.companyCreateService.execute(dto);
  }

  @Patch(':id/avatar')
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @User() userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    return await this.companyUpdateAvatarService.execute(id, file, userRequest);
  }

  @Delete(':id/avatar')
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.DELETE)
  async deleteAvatar(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    return await this.companyDeleteAvatarService.execute(id, userRequest);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: CompanyUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    return await this.companyUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    return await this.companyDeleteService.execute(id, userRequest);
  }

  @Patch(':id/status')
  @RequireAbilities($Enums.AbilityCodes.COMPANIES, $Enums.AbilityActions.UPDATE)
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: CompanyUpdateStatusDto,
    @User() userRequest: UserRequest,
  ): Promise<CompanyEntity> {
    return await this.companyUpdateStatusService.execute(id, dto, userRequest);
  }
}
