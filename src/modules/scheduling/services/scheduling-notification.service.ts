import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SchedulingEntity } from '../domain/entities/scheduling.entity';
import * as twilio from 'twilio';
import { removeSpecialCharacters } from 'src/shared/utils/string';
import { removeDigitNine } from 'src/shared/utils/phone';
import { formatDateBr } from 'src/shared/utils/date';

@Injectable()
export class SchedulingNotificationService {
  constructor(private prisma: PrismaService) {}
  async getSchedulings(): Promise<SchedulingEntity[]> {
    const targetDate = new Date();

    const startOfDay = new Date(targetDate);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    startOfDay.setHours(0, 0, 0, 0);

    const schedulings = await this.prisma.scheduling.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        client: true,
        company: true,
        barber: true,
        horary: true,
      },
    });

    return schedulings.map((scheduling) => new SchedulingEntity(scheduling));
  }

  async sendMessage(scheduling: SchedulingEntity) {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    const twilioNumber: string = process.env.TWILIO_PHONE_NUMBER;

    return await client.messages.create({
      body: `Lembrete de agendamento na barbearia ${scheduling.company.name}, ${formatDateBr(scheduling.date)} - ${scheduling.horary.time} com o barbeiro ${scheduling.barber.name}`,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:+55${removeSpecialCharacters(removeDigitNine(scheduling.client.phone))}`,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    const schedulings: SchedulingEntity[] = await this.getSchedulings();
    schedulings.map((scheduling) => this.sendMessage(scheduling));
  }
}
