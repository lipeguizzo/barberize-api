import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthLoginService } from './services/auth-login.service';
import { AuthRecoverPasswordService } from './services/auth-recover-password.service';
import { AuthResetPasswordService } from './services/auth-reset-password.service';
import { AuthRegisterService } from './services/auth-register.service';
import { AuthRefreshService } from './services/auth-refresh.service';
import { WorkingDayCreateDefaultService } from '../working-day/services/working-day-create-default.service';
import { HolidayCreateDefaultService } from '../holiday/services/holiday-create-default.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthLoginService,
    AuthRegisterService,
    AuthRecoverPasswordService,
    AuthResetPasswordService,
    AuthRefreshService,
    WorkingDayCreateDefaultService,
    HolidayCreateDefaultService,
  ],
})
export class AuthModule {}
