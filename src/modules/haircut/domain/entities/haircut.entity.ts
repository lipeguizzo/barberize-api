import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';

export class HaircutEntity {
  id: number;
  name: string;
  price: number;
  duration: number;
  companyId: number;
  company?: CompanyEntity;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: HaircutEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    Object.assign(this, {
      company,
      ...partial,
    });
  }
}
