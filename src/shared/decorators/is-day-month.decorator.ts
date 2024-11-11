import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

interface IsDayMonthOptions {
  isOptional?: boolean;
}

export const IsDayMonth = (options?: IsDayMonthOptions): PropertyDecorator => {
  const decorators = [
    Transform(({ value }) => (value ? value : undefined)),
    Type(() => String),
    IsString({
      message: 'Feriado inválida!',
    }),
    Matches(/^([0-2]\d|3[01])-(0\d|1[0-2])$/, {
      message: 'A data deve estar no formato dd-mm!',
    }),
  ];
  if (options?.isOptional) decorators.unshift(IsOptional());

  return applyDecorators(...decorators);
};
