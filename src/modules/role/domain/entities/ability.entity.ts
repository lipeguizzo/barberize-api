import { $Enums } from '@prisma/client';

export class AbilityEntity {
  id: number;
  code: $Enums.AbilityCodes;
  action: $Enums.AbilityActions;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: AbilityEntity) {
    Object.assign(this, {
      ...partial,
    });
  }
}
