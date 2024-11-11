import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { Public } from 'src/shared/decorators/public.decorator';
import { AuthLoginResponseDto } from '../domain/dto/auth-login-response.dto';
import { AuthLoginDto } from '../domain/dto/auth-login.dto';
import { AuthRecoverPasswordResponseDto } from '../domain/dto/auth-recover-password-response.dto';
import { AuthRecoverPasswordDto } from '../domain/dto/auth-recover-password.dto';
import { AuthResetPasswordDto } from '../domain/dto/auth-reset-password.dto';
import { AuthRegisterDto } from '../domain/dto/auth-register.dto';
import { AuthLoginService } from '../services/auth-login.service';
import { AuthResetPasswordService } from '../services/auth-reset-password.service';
import { AuthRegisterService } from '../services/auth-register.service';
import { AuthRecoverPasswordService } from './../services/auth-recover-password.service';
import { AuthRefreshDto } from '../domain/dto/auth-refresh.dto';
import { AuthRefreshResponseDto } from '../domain/dto/auth-refresh-response.dto';
import { AuthRefreshService } from '../services/auth-refresh.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authLoginService: AuthLoginService,
    private readonly authRegisterService: AuthRegisterService,
    private readonly authRecoverPasswordService: AuthRecoverPasswordService,
    private readonly authResetPasswordService: AuthResetPasswordService,
    private readonly authRefreshService: AuthRefreshService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    return await this.authLoginService.execute(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: AuthRefreshDto): Promise<AuthRefreshResponseDto> {
    return await this.authRefreshService.execute(dto.refreshToken);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: AuthRegisterDto): Promise<UserEntity> {
    return await this.authRegisterService.execute(dto);
  }

  @Public()
  @Post('recover-password')
  @HttpCode(HttpStatus.OK)
  async recoverPassword(
    @Body() dto: AuthRecoverPasswordDto,
  ): Promise<AuthRecoverPasswordResponseDto> {
    return await this.authRecoverPasswordService.execute(dto);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() dto: AuthResetPasswordDto): Promise<UserEntity> {
    return await this.authResetPasswordService.execute(dto);
  }
}
