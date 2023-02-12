import { HttpNoneResponse } from './http-none-response.interface';

export type HttpPagingResponse<T> = HttpNoneResponse & {
  data: {
    pages: number;
    page: number;
    amount?: number;
    data: T[] | T | null;
  };
};
