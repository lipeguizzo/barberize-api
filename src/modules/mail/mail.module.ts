import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './services/mail.service';

@Global()
@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: process.env.MAIL_SERVICE,
          host: process.env.MAIL_HOST,
          secure: process.env.MAIL_SECURE === 'true' ? true : false,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.MAIL_DEFAULT,
        },
        template: {
          dir: process.cwd() + '/public/templates/views/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
        options: {
          partials: {
            dir: process.cwd() + '/public/templates/partials/',
            strict: false,
          },
        },
      }),
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
