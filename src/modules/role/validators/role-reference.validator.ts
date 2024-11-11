import { $Enums } from '@prisma/client';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRequest } from 'src/shared/types/user-request';

export async function roleReferenceValidator(
  reference: $Enums.RoleReferences,
  userRequest: UserRequest,
) {
  if (!userRequest) throw new UnauthorizedException('Usuário não encontrado!');

  const isAdmin: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.ADMIN;

  const isAdminCompany: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.ADMIN_COMPANY;

  const isProfessional: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.PROFESSIONAL;

  const isCLient: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.CLIENT;

  if (!reference) throw new NotFoundException('Referência não encontrada!');

  if (userRequest.role?.reference === $Enums.RoleReferences.ADMIN && isAdmin)
    return;

  if (
    reference === $Enums.RoleReferences.ADMIN_COMPANY &&
    (isAdmin || isAdminCompany)
  )
    return;

  if (
    reference === $Enums.RoleReferences.PROFESSIONAL &&
    (isAdmin || isAdminCompany || isProfessional)
  )
    return;

  if (
    reference === $Enums.RoleReferences.CLIENT &&
    (isAdmin || isAdminCompany || isProfessional || isCLient)
  )
    return;

  if (userRequest?.role?.reference !== reference)
    throw new UnauthorizedException('Usuário sem permissão nesse perfil!');
}
