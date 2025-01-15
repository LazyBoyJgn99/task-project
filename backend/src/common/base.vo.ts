export class PageVo<T> {
  pageSize: number;
  pageNumber: number;
  total: number;
  list: T[];
}
