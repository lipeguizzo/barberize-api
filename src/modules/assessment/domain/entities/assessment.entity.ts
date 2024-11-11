import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class AssessmentEntity {
  id: number;
  score: number;
  commentary?: string;
  companyId: number;
  company?: CompanyEntity;
  clientId: number;
  client?: UserEntity;
  barberId: number;
  barber?: UserEntity;
  createdAt: Date;

  constructor(partial: AssessmentEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    const client = partial.client && new UserEntity(partial.client);
    const barber = partial.barber && new UserEntity(partial.barber);
    Object.assign(this, {
      company,
      client,
      barber,
      ...partial,
    });
  }
}
