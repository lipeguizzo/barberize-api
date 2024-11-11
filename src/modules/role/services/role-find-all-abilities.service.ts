import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AbilityEntity } from './../domain/entities/ability.entity';

@Injectable()
export class RoleFindAllAbilitiesService {
  constructor(private prisma: PrismaService) {}
  async execute(): Promise<AbilityEntity[]> {
    const findAbilities = await this.prisma.ability.findMany();

    return findAbilities.map((ability) => new AbilityEntity(ability));
  }
}
