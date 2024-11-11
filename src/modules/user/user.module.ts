import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserCreateService } from './services/user-create.service';
import { UserDeleteService } from './services/user-delete.service';
import { UserFindManyService } from './services/user-find-many.service';
import { UserFindOneService } from './services/user-find-one.service';
import { UserFindSelfService } from './services/user-find-self.service';
import { UserUpdateAvatarService } from './services/user-update-avatar.service';
import { UserUpdateSelfService } from './services/user-update-self.service';
import { UserUpdateStatusService } from './services/user-update-status.service';
import { UserUpdateService } from './services/user-update.service';
import { UserDeleteAvatarService } from './services/user-delete-avatar.service';

@Module({
  controllers: [UserController],
  providers: [
    UserFindManyService,
    UserFindOneService,
    UserFindSelfService,
    UserCreateService,
    UserUpdateService,
    UserDeleteService,
    UserUpdateStatusService,
    UserUpdateSelfService,
    UserUpdateAvatarService,
    UserDeleteAvatarService,
  ],
})
export class UserModule {}
