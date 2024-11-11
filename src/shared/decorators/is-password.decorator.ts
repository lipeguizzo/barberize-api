import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

interface IsPasswordOptions {
  isOptional?: boolean;
}

export const IsPassword = (options?: IsPasswordOptions): PropertyDecorator => {
  const decorators = [
    Transform(({ value }) => (value ? value : undefined)),
    Type(() => String),
    IsString({
      message: 'Senha inválida!',
    }),
    Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
      message:
        'Senha deve ter pelo menos 1 carácter maiúsculo, 1 carácter minúsculo, 1 um carácter numérico e um carácter especial!',
    }),
  ];
  if (options?.isOptional) decorators.unshift(IsOptional());

  return applyDecorators(...decorators);
};
