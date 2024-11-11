export interface IPaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  links: {
    first: string | null;
    prev: string | null;
    next: string | null;
    last: string | null;
  };
}
