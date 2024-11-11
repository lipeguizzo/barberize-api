import { $Enums } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';
import { HaircutEntity } from 'src/modules/haircut/domain/entities/haircut.entity';
import { HoraryEntity } from 'src/modules/horary/domain/entities/horary.entity';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class SchedulingEntity {
  id: number;
  date: Date;
  companyId: number;
  company?: CompanyEntity;
  horaryId: number;
  horary?: HoraryEntity;
  haircutId: number;
  haircut?: HaircutEntity;
  clientId: number;
  client?: UserEntity;
  barberId: number;
  barber?: UserEntity;
  status: $Enums.SchedulingStatus;
  createdAt: Date;

  constructor(partial: SchedulingEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    const horary = partial.horary && new HoraryEntity(partial.horary);
    const haircut = partial.haircut && new HaircutEntity(partial.haircut);
    const client = partial.client && new UserEntity(partial.client);
    const barber = partial.barber && new UserEntity(partial.barber);
    Object.assign(this, {
      company,
      horary,
      haircut,
      client,
      barber,
      ...partial,
    });
  }
}
