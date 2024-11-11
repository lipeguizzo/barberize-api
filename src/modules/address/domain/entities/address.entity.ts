export class AddressEntity {
  id: number;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  complement: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: AddressEntity) {
    Object.assign(this, { ...partial });
  }
}
