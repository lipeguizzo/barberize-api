import { ConflictException, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { AuthRegisterDto } from '../domain/dto/auth-register.dto';
import { WorkingDayCreateDefaultService } from 'src/modules/working-day/services/working-day-create-default.service';
import { HolidayCreateDefaultService } from 'src/modules/holiday/services/holiday-create-default.service';
import { EMailTemplate } from 'src/modules/mail/domain/enums/mail-template.enum';
import { IMailOption } from 'src/modules/mail/domain/interfaces/mail-option.interface';
import { IAuthCompanyActivation } from '../domain/interfaces/auth-company-activation.interface';
import { MailService } from 'src/modules/mail/services/mail.service';

@Injectable()
export class AuthRegisterService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private workingDayCreateDefaultService: WorkingDayCreateDefaultService,
    private holidayCreateDefaultService: HolidayCreateDefaultService,
  ) {}
  async execute(dto: AuthRegisterDto): Promise<UserEntity> {
    const isCompany: boolean =
      dto.reference === $Enums.RoleReferences.ADMIN_COMPANY;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ name: dto.name }, { email: dto.email }],
        deletedAt: null,
      },
    });

    if (user)
      throw new ConflictException('Nome ou e-mail de Usuário já cadastrado!');

    if (isCompany) {
      const company = await this.prisma.company.findFirst({
        where: {
          OR: [{ name: dto.companyName }, { email: dto.companyEmail }],
          deletedAt: null,
        },
      });
      if (company)
        throw new ConflictException('Nome ou e-mail de empresa já cadastrado!');

      const createdCompany = await this.prisma.company.create({
        data: {
          name: dto.companyName,
          email: dto.companyEmail,
          tradeName: dto.companyTradeName,
          status: $Enums.Status.WAITING,
          address: {
            create: dto.address,
          },
        },
      });

      await this.workingDayCreateDefaultService.execute(createdCompany.id);
      await this.holidayCreateDefaultService.execute(createdCompany.id);

      const createdUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          gender: dto.gender,
          phone: dto.phone,
          status: $Enums.Status.WAITING,
          password: await hash(dto.password, 10),
          role: {
            connect: {
              id: 2,
            },
          },
          company: {
            connect: {
              id: createdCompany.id,
            },
          },
        },
        include: {
          role: true,
          company: true,
          avatar: true,
        },
      });

      const url = `${process.env.FRONT_END_URL}`;

      const options: IMailOption<IAuthCompanyActivation> = {
        to: process.env.ADMIN_EMAIL,
        subject: 'Cadastro de empresa:',
        template: EMailTemplate.COMPANY_ACTIVATION,
        context: {
          name: createdCompany.name,
          url: url,
        },
      };

      await this.mailService.send(options);

      return new UserEntity(createdUser);
    } else {
      const createdUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          gender: dto.gender,
          phone: dto.phone,
          status: $Enums.Status.ACTIVE,
          password: await hash(dto.password, 10),
          role: {
            connect: {
              id: 4,
            },
          },
        },
        include: {
          role: true,
          company: true,
          avatar: true,
        },
      });

      return new UserEntity(createdUser);
    }
  }
}
