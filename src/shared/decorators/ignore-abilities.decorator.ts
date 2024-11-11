import { SetMetadata } from '@nestjs/common';

export const IGNORE_ABILITIES_KEY = 'ignoreAbilities';
export const IgnoreAbilities = () => SetMetadata(IGNORE_ABILITIES_KEY, true);
