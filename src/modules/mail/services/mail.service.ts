import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailOption } from '../domain/interfaces/mail-option.interface';
import { IAttachment } from '../domain/interfaces/attachment.interface';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send<T>(options: IMailOption<T>): Promise<void> {
    const defaultAttachments: IAttachment[] = [
      {
        filename: 'barberize-logo.png',
        path: join(
          process.cwd(),
          'public/templates/assets/images/barberize-logo.png',
        ),
        cid: 'logo',
      },
      {
        filename: 'facebook.png',
        path: join(process.cwd(), 'public/templates/assets/icons/facebook.png'),
        cid: 'facebook',
      },
      {
        filename: 'instagram.png',
        path: join(
          process.cwd(),
          'public/templates/assets/icons/instagram.png',
        ),
        cid: 'instagram',
      },
      {
        filename: 'whatsapp.png',
        path: join(process.cwd(), 'public/templates/assets/icons/whatsapp.png'),
        cid: 'whatsapp',
      },
    ];
    await this.mailerService.sendMail({
      ...options,
      attachments: [...defaultAttachments, ...(options.attachments ?? [])],
    });
  }
}
