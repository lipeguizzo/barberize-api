import { ConflictException } from '@nestjs/common';
import { RoleEntity } from '../domain/entities/role.entity';

export function roleDefaultValidator(role: RoleEntity): void {
  if (role.isDefault)
    throw new ConflictException(
      'Perfil padrão, não possível atualizar ou deletar!',
    );
}
