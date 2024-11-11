import { EMailTemplate } from '../enums/mail-template.enum';
import { IAttachment } from './attachment.interface';

export interface IMailOption<T> {
  to: string | string[];
  subject: string;
  template: EMailTemplate;
  context: T;
  attachments?: IAttachment[];
}
