import { IPaginationMetadata } from './../interfaces/pagination-metadata.interface';

export type PaginationResponseDto<T> = {
  data: T[];
  _meta: IPaginationMetadata;
};
