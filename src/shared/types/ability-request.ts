import { $Enums } from '@prisma/client';

export type AbilityRequest = {
  code: $Enums.AbilityCodes;
  action: $Enums.AbilityActions;
};
