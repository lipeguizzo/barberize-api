import { SchedulingEntity } from 'src/modules/scheduling/domain/entities/scheduling.entity';

export class HistoryEntity {
  id: number;
  action: string;
  schedulingId: number;
  scheduling?: SchedulingEntity;
  createdAt: Date;

  constructor(partial: HistoryEntity) {
    const scheduling =
      partial.scheduling && new SchedulingEntity(partial.scheduling);
    Object.assign(this, {
      scheduling,
      ...partial,
    });
  }
}
