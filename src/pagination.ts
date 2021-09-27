export class PagedQuery {
  limit: number;

  offset: number;
}

export class PagedResponse<T> {
  items: T[];

  total: number;
}
