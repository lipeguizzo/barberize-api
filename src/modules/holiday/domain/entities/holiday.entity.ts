import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';

export class HolidayEntity {
  id: number;
  name: string;
  dayMonth: string;
  companyId: number;
  company?: CompanyEntity;
  createdAt: Date;

  constructor(partial: HolidayEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    Object.assign(this, {
      company,
      ...partial,
    });
  }
}
