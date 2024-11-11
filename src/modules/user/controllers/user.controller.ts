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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { UserCreateDto } from '../domain/dto/user-create.dto';
import { UserFindManyDto } from '../domain/dto/user-find-many.dto';
import { UserUpdateSelfDto } from '../domain/dto/user-update-self.dto';
import { UserUpdateStatusDto } from '../domain/dto/user-update-status.dto';
import { UserUpdateDto } from '../domain/dto/user-update.dto';
import { UserCreateService } from '../services/user-create.service';
import { UserDeleteService } from '../services/user-delete.service';
import { UserFindManyService } from '../services/user-find-many.service';
import { UserFindOneService } from '../services/user-find-one.service';
import { UserFindSelfService } from '../services/user-find-self.service';
import { UserRequest } from 'src/shared/types/user-request';
import { UserUpdateSelfService } from '../services/user-update-self.service';
import { UserUpdateStatusService } from '../services/user-update-status.service';
import { UserUpdateService } from '../services/user-update.service';
import { RequireAbilities } from 'src/shared/decorators/require-abilities.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateAvatarService } from '../services/user-update-avatar.service';
import { PaginationResponseDto } from 'src/shared/domain/dto/pagination-response.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { UserDeleteAvatarService } from '../services/user-delete-avatar.service';
import { IgnoreAbilities } from 'src/shared/decorators/ignore-abilities.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userFindManyService: UserFindManyService,
    private readonly userFindOneService: UserFindOneService,
    private readonly userFindSelfService: UserFindSelfService,
    private readonly userCreateService: UserCreateService,
    private readonly userUpdateService: UserUpdateService,
    private readonly userUpdateSelfService: UserUpdateSelfService,
    private readonly userUpdateStatusService: UserUpdateStatusService,
    private readonly userDeleteService: UserDeleteService,
    private readonly userUpdateAvatarService: UserUpdateAvatarService,
    private readonly userDeleteAvatarService: UserDeleteAvatarService,
  ) {}

  @Get()
  @IgnoreAbilities()
  async findAll(
    @Query() params: UserFindManyDto,
    @User() userRequest: UserRequest,
  ): Promise<PaginationResponseDto<UserEntity>> {
    return await this.userFindManyService.execute(params, userRequest);
  }

  @Get('self')
  @IgnoreAbilities()
  async findSelf(@User() userRequest: UserRequest): Promise<UserEntity> {
    return await this.userFindSelfService.execute(userRequest);
  }

  @Get(':id')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.READ)
  async findOne(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userFindOneService.execute(id, userRequest);
  }

  @Post()
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.CREATE)
  async create(
    @Body() dto: UserCreateDto,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userCreateService.execute(dto, userRequest);
  }

  @Put('self')
  @IgnoreAbilities()
  async updateSelf(
    @Body() dto: UserUpdateSelfDto,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userUpdateSelfService.execute(dto, userRequest);
  }

  @Patch('avatar')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userUpdateAvatarService.execute(file, userRequest);
  }

  @Delete('avatar')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.DELETE)
  async deleteAvatar(@User() userRequest: UserRequest): Promise<UserEntity> {
    return await this.userDeleteAvatarService.execute(userRequest);
  }

  @Put(':id')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() dto: UserUpdateDto,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userUpdateService.execute(id, dto, userRequest);
  }

  @Delete(':id')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.DELETE)
  async delete(
    @Param('id') id: number,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userDeleteService.execute(id, userRequest);
  }

  @Patch(':id/status')
  @RequireAbilities($Enums.AbilityCodes.USERS, $Enums.AbilityActions.UPDATE)
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: UserUpdateStatusDto,
    @User() userRequest: UserRequest,
  ): Promise<UserEntity> {
    return await this.userUpdateStatusService.execute(id, dto, userRequest);
  }
}
