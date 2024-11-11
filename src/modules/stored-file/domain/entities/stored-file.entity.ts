export class StoredFileEntity {
  id: number;
  uuid: string;
  alt: string;
  originalName: string;
  storedName: string;
  relativePath: string;
  contentType: string;
  isPublic: boolean;
  checksum: string;
  createdAt: Date;

  constructor(partial: StoredFileEntity) {
    Object.assign(this, {
      ...partial,
    });
  }
}
