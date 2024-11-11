import { $Enums } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export const ABILITIES_KEY = 'abilities';
export const RequireAbilities = (
  code: $Enums.AbilityCodes,
  action: $Enums.AbilityActions,
) => SetMetadata(ABILITIES_KEY, { code: code, action: action });
