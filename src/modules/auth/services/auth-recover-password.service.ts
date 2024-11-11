import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { TokenSignService } from 'src/shared/services/token-sign.service';
import { AuthRecoverPasswordDto } from '../domain/dto/auth-recover-password.dto';
import { MailService } from 'src/modules/mail/services/mail.service';
import { IMailOption } from 'src/modules/mail/domain/interfaces/mail-option.interface';
import { EMailTemplate } from 'src/modules/mail/domain/enums/mail-template.enum';
import { AuthRecoverPasswordResponseDto } from '../domain/dto/auth-recover-password-response.dto';
import { IAuthRecoverPassword } from '../domain/interfaces/auth-recover-password.interface';

@Injectable()
export class AuthRecoverPasswordService {
  constructor(
    private prisma: PrismaService,
    private tokenSignService: TokenSignService,
    private mailService: MailService,
  ) {}
  async execute(
    dto: AuthRecoverPasswordDto,
  ): Promise<AuthRecoverPasswordResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('E-mail incorreto!');

    const token = await this.tokenSignService.execute(user, '10m');

    const url = `${process.env.FRONT_END_URL}/recuperar-senha/nova-senha?token=${token}`;

    const options: IMailOption<IAuthRecoverPassword> = {
      to: user.email,
      subject: 'Recuperação de Senha:',
      template: EMailTemplate.RECOVER_PASSWORD,
      context: {
        name: user.name,
        url: url,
      },
    };

    await this.mailService.send(options);

    return { message: 'E-mail enviado com sucesso!' };
  }
}
