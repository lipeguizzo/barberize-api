import { $Enums } from '@prisma/client';
import { CompanyEntity } from '../../../company/domain/entities/company.entity';

export class RoleEntity {
  id: number;
  name: string;
  isDefault: boolean;
  status: $Enums.Status;
  reference: $Enums.RoleReferences;
  companyId?: number;
  company?: CompanyEntity;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: RoleEntity) {
    const company = partial.company && new CompanyEntity(partial.company);
    Object.assign(this, {
      company,
      ...partial,
    });
  }
}
