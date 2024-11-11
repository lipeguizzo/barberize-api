import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AddressModule } from 'src/modules/address/address.module';
import { AssessmentModule } from 'src/modules/assessment/assessment.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CompanyModule } from 'src/modules/company/company.module';
import { HaircutModule } from 'src/modules/haircut/haircut.module';
import { HistoryModule } from 'src/modules/history/history.module';
import { HolidayModule } from 'src/modules/holiday/holiday.module';
import { HoraryModule } from 'src/modules/horary/horary.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { RoleModule } from 'src/modules/role/role.module';
import { SchedulingModule } from 'src/modules/scheduling/scheduling.module';
import { StoredFileModule } from 'src/modules/stored-file/stored-file.module';
import { UserModule } from 'src/modules/user/user.module';
import { WorkingDayModule } from 'src/modules/working-day/working-day.module';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserAbilitiesGuard } from 'src/shared/guards/user-abilities.guard';
import { TokenSignService } from 'src/shared/services/token-sign.service';
import { TokenVerifyService } from 'src/shared/services/token-verify.service';
import { PrismaService } from './database/prisma.service';
import { AwsFileSystem } from './file-system/storage/aws.file-system';

@Global()
@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    CompanyModule,
    HaircutModule,
    HoraryModule,
    WorkingDayModule,
    HolidayModule,
    SchedulingModule,
    AssessmentModule,
    HistoryModule,
    AddressModule,
    StoredFileModule,
    MailModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    TokenSignService,
    TokenVerifyService,
    AwsFileSystem,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserAbilitiesGuard,
    },
  ],
  exports: [PrismaService, TokenSignService, TokenVerifyService, AwsFileSystem],
})
export class InfraModule {}
