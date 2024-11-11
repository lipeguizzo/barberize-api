import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

interface IsTimeOptions {
  isOptional?: boolean;
}

export const IsTime = (options?: IsTimeOptions): PropertyDecorator => {
  const decorators = [
    Transform(({ value }) => (value ? value : undefined)),
    Type(() => String),
    IsString({
      message: 'Horário inválido!',
    }),
    Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'O horário deve estar no formato HH:mm!',
    }),
  ];
  if (options?.isOptional) decorators.unshift(IsOptional());

  return applyDecorators(...decorators);
};
