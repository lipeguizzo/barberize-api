import { $Enums } from '@prisma/client';
import { CompanyEntity } from 'src/modules/company/domain/entities/company.entity';

export class WorkingDayEntity {
  id: number;
  day: $Enums.DayOfWeek;
  isOpen: boolean;
  companyId: number;
  company?: CompanyEntity;
  createdAt: Date;

  constructor(partial: WorkingDayEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    Object.assign(this, {
      company,
      ...partial,
    });
  }
}
