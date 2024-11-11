import { $Enums } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SchedulingUpdateStatusDto } from '../domain/dto/scheduling-update-status.dto';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import { UserRequest } from 'src/shared/types/user-request';
import { MailService } from 'src/modules/mail/services/mail.service';
import { IMailOption } from 'src/modules/mail/domain/interfaces/mail-option.interface';
import { ISchedulingUpdateStatus } from '../domain/interfaces/scheduling-update-status.interface';
import { EMailTemplate } from 'src/modules/mail/domain/enums/mail-template.enum';
import { formatDateBr } from 'src/shared/utils/date';

@Injectable()
export class SchedulingUpdateStatusService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  async execute(
    id: number,
    dto: SchedulingUpdateStatusDto,
    userRequest: UserRequest,
  ): Promise<SchedulingEntity> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        id: id,
        companyId: userRequest.companyId ?? undefined,
      },
    });

    if (!scheduling) throw new NotFoundException('Agendamento não encontrado!');

    const updatedScheduling = await this.prisma.scheduling.update({
      data: {
        status: dto.status,
      },
      where: {
        id: id,
      },
      include: {
        client: true,
        barber: true,
        company: true,
        horary: true,
      },
    });

    const to: string[] = [
      updatedScheduling.client.email,
      updatedScheduling.barber.email,
      updatedScheduling.company.email,
    ];

    const context: ISchedulingUpdateStatus = {
      date: formatDateBr(updatedScheduling.date),
      horary: updatedScheduling.horary.time,
      client: updatedScheduling.client.name,
      barber: updatedScheduling.barber.name,
      company: updatedScheduling.company.name,
    };

    if (dto.status === $Enums.SchedulingStatus.CANCELED) {
      const options: IMailOption<ISchedulingUpdateStatus> = {
        to: to,
        subject: 'Agendamento cancelado:',
        template: EMailTemplate.SCHEDULING_CANCEL,
        context: context,
      };
      await this.mailService.send(options);
    }

    if (dto.status === $Enums.SchedulingStatus.CONFIRMED) {
      const options: IMailOption<ISchedulingUpdateStatus> = {
        to: to,
        subject: 'Agendamento confirmado:',
        template: EMailTemplate.SCHEDULING_CONFIRM,
        context: context,
      };
      await this.mailService.send(options);
    }

    if (dto.status === $Enums.SchedulingStatus.COMPLETED) {
      const options: IMailOption<ISchedulingUpdateStatus> = {
        to: to,
        subject: 'Agendamento finalizado:',
        template: EMailTemplate.SCHEDULING_COMPLETED,
        context: context,
      };
      await this.mailService.send(options);
    }

    return new SchedulingEntity(updatedScheduling);
  }
}
