import { UnauthorizedException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { UserRequest } from 'src/shared/types/user-request';

interface IReferencePermission {
  reference: $Enums.RoleReferences;
}

export function roleReferencePermission(
  userRequest: UserRequest,
): IReferencePermission[] {
  if (!userRequest) throw new UnauthorizedException('Usuário não encontrado!');

  const referencePermissions: IReferencePermission[] = [];

  const isAdmin: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.ADMIN;

  const isAdminCompany: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.ADMIN_COMPANY;

  const isProfessional: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.PROFESSIONAL;

  const isCLient: boolean =
    userRequest.role?.reference === $Enums.RoleReferences.CLIENT;

  if (isAdmin)
    referencePermissions.push({
      reference: $Enums.RoleReferences.ADMIN,
    });

  if (isAdmin || isAdminCompany)
    referencePermissions.push({
      reference: $Enums.RoleReferences.ADMIN_COMPANY,
    });

  if (isAdmin || isAdminCompany || isProfessional)
    referencePermissions.push({
      reference: $Enums.RoleReferences.PROFESSIONAL,
    });

  if (isAdmin || isAdminCompany || isProfessional || isCLient)
    referencePermissions.push({
      reference: $Enums.RoleReferences.CLIENT,
    });

  return referencePermissions;
}
