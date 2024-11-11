import { IPaginationMetadata } from '../domain/interfaces/pagination-metadata.interface';
import { QueryParamsValue } from '../types/query-params-value';

function generatePaginationMetaLinks(
  baseUrl: string,
  currentPage: number,
  totalItems: number,
  pageSize: number,
  queryParams?: Record<string, QueryParamsValue>,
): {
  first: string | null;
  prev: string | null;
  next: string | null;
  last: string | null;
} {
  const totalPages = Math.ceil(totalItems / pageSize);

  const getQueryString = (params: Record<string, QueryParamsValue>): string => {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((item) => `${key}=${item}`).join('&');
        } else {
          return `${key}=${value}`;
        }
      })
      .join('&');
  };

  const getLink = (page: number): string | null => {
    if (page < 1 || page > totalPages) {
      return null;
    }

    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...queryParams,
    };

    const queryString = getQueryString(params);
    return `${baseUrl}?${queryString}`;
  };

  const first = getLink(1);
  const prev = getLink(currentPage - 1);
  const next = getLink(currentPage + 1);
  const last = getLink(totalPages);

  return { first, prev, next, last };
}

export function generatePaginationMeta(
  baseUrl: string,
  totalItems: number,
  currentPage: number,
  pageSize: number,
  queryParams?: Record<string, QueryParamsValue>,
): IPaginationMetadata {
  const totalPages = Math.ceil(totalItems / pageSize);

  const links = generatePaginationMetaLinks(
    baseUrl,
    currentPage,
    totalItems,
    pageSize,
    queryParams,
  );

  return {
    page: currentPage,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: totalPages,
    links: links,
  };
}
