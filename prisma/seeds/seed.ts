import { PrismaClient, $Enums } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function createAbilities(): Promise<void> {
  const actions = [
    $Enums.AbilityActions.READ,
    $Enums.AbilityActions.CREATE,
    $Enums.AbilityActions.UPDATE,
    $Enums.AbilityActions.DELETE,
  ];
  await prisma.ability.createMany({
    data: [
      {
        code: $Enums.AbilityCodes.ADMIN,
      },
      {
        code: $Enums.AbilityCodes.COMPANIES,
      },
      {
        code: $Enums.AbilityCodes.USERS,
      },
      {
        code: $Enums.AbilityCodes.ROLES,
      },
      {
        code: $Enums.AbilityCodes.HAIRCUTS,
      },
      {
        code: $Enums.AbilityCodes.ASSESSMENTS,
      },
      {
        code: $Enums.AbilityCodes.HOURS,
      },
      {
        code: $Enums.AbilityCodes.WORKING_DAYS,
      },
      {
        code: $Enums.AbilityCodes.HOLIDAYS,
      },
      {
        code: $Enums.AbilityCodes.SCHEDULINGS,
      },
      {
        code: $Enums.AbilityCodes.HISTORIES,
      },
    ].flatMap((data) =>
      actions.map((action) => ({
        ...data,
        action,
      })),
    ),
  });
}

async function createRoles(): Promise<void> {
  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        reference: $Enums.RoleReferences.ADMIN,
        isDefault: true,
      },
      {
        name: 'Admin Empresa',
        reference: $Enums.RoleReferences.ADMIN_COMPANY,
        isDefault: true,
      },
      {
        name: 'Profissional',
        reference: $Enums.RoleReferences.PROFESSIONAL,
        isDefault: true,
      },
      {
        name: 'Cliente',
        reference: $Enums.RoleReferences.CLIENT,
        isDefault: true,
      },
    ],
  });
}

async function createRolesAbilities(): Promise<void> {
  const abilities = await prisma.ability.findMany({
    select: { id: true, code: true, action: true },
  });

  const companyAbilities = abilities.filter((ability) => {
    if (ability.code === $Enums.AbilityCodes.ADMIN) return;
    if (ability.code === $Enums.AbilityCodes.COMPANIES) {
      if (ability.action === $Enums.AbilityActions.CREATE) return;
      if (ability.action === $Enums.AbilityActions.DELETE) return;
    }
    return true;
  });

  const professionalAbilities = abilities.filter(
    (ability) =>
      ability.code !== $Enums.AbilityCodes.ADMIN &&
      ability.code !== $Enums.AbilityCodes.COMPANIES &&
      ability.code !== $Enums.AbilityCodes.ROLES &&
      ability.code !== $Enums.AbilityCodes.WORKING_DAYS &&
      ability.code !== $Enums.AbilityCodes.HOLIDAYS &&
      ability.code !== $Enums.AbilityCodes.USERS,
  );

  const clientAbilities = abilities.filter(
    (ability) =>
      ability.code !== $Enums.AbilityCodes.ADMIN &&
      ability.code !== $Enums.AbilityCodes.COMPANIES &&
      ability.code !== $Enums.AbilityCodes.ROLES &&
      ability.code !== $Enums.AbilityCodes.USERS &&
      ability.code !== $Enums.AbilityCodes.HAIRCUTS &&
      ability.code !== $Enums.AbilityCodes.WORKING_DAYS &&
      ability.code !== $Enums.AbilityCodes.HOLIDAYS &&
      ability.code !== $Enums.AbilityCodes.HOURS,
  );

  // Admin
  await prisma.roleAbility.createMany({
    data: [
      {
        roleId: 1,
      },
    ].flatMap((data) =>
      abilities.map(({ id }) => ({
        ...data,
        abilityId: id,
      })),
    ),
  });

  // Admin Company
  await prisma.roleAbility.createMany({
    data: [
      {
        roleId: 2,
      },
    ].flatMap((data) =>
      companyAbilities.map(({ id }) => ({
        ...data,
        abilityId: id,
      })),
    ),
  });

  // Professional
  await prisma.roleAbility.createMany({
    data: [
      {
        roleId: 3,
      },
    ].flatMap((data) =>
      professionalAbilities.map(({ id }) => ({
        ...data,
        abilityId: id,
      })),
    ),
  });

  // Client
  await prisma.roleAbility.createMany({
    data: [
      {
        roleId: 4,
      },
    ].flatMap((data) =>
      clientAbilities.map(({ id }) => ({
        ...data,
        abilityId: id,
      })),
    ),
  });
}

async function createUser(): Promise<void> {
  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: await hash(process.env.ADMIN_PASSWORD, 10),
      gender: $Enums.Gender.M,
      phone: '',
      status: $Enums.Status.ACTIVE,
      role: {
        connect: {
          id: 1,
        },
      },
    },
  });
}

async function execute(): Promise<void> {
  try {
    await createAbilities();
    await createRoles();
    await createRolesAbilities();
    await createUser();
  } catch (e) {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

execute();
