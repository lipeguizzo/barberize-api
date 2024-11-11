import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';

export class HoraryEntity {
  id: number;
  time: string;
  isAvailable: boolean;
  companyId: number;
  company?: CompanyEntity;
  createdAt: Date;

  constructor(partial: HoraryEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    Object.assign(this, {
      company,
      ...partial,
    });
  }
}
