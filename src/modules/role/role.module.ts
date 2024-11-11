import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleFindManyService } from './services/role-find-many.service';
import { RoleFindAbilitiesService } from './services/role-find-abilities.service';
import { RoleFindOneService } from './services/role-find-one.service';
import { RoleCreateService } from './services/role-create.service';
import { RoleUpdateService } from './services/role-update.service';
import { RoleDeleteService } from './services/role-delete.service';
import { RoleUpdateStatusService } from './services/role-update-status.service';
import { RoleFindAllAbilitiesService } from './services/role-find-all-abilities.service';

@Module({
  controllers: [RoleController],
  providers: [
    RoleFindManyService,
    RoleFindOneService,
    RoleFindAllAbilitiesService,
    RoleFindAbilitiesService,
    RoleCreateService,
    RoleUpdateService,
    RoleUpdateStatusService,
    RoleDeleteService,
  ],
})
export class RoleModule {}
