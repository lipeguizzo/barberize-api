import { $Enums } from '@prisma/client';
import { AddressEntity } from 'src/modules/address/domain/entities/address.entity';
import { StoredFileEntity } from 'src/modules/stored-file/domain/entities/stored-file.entity';

export class CompanyEntity {
  id: number;
  name: string;
  tradeName?: string;
  email: string;
  status: $Enums.Status;
  address?: AddressEntity;
  avatarId?: number;
  avatar?: StoredFileEntity;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: CompanyEntity) {
    const address = partial.address && new AddressEntity(partial.address);
    const avatar = partial.avatar && new StoredFileEntity(partial.avatar);
    Object.assign(this, {
      address,
      avatar,
      ...partial,
    });
  }
}
