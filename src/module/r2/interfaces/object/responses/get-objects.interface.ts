import { HttpNoneResponse } from '@common/interfaces/http-none-response.interface';

export type IObjectPagingResponse<T> = HttpNoneResponse & {
  data: {
    pages: number | null;
    page: number | null;
    amount: number;
    data: T[] | T | null;
  };
};
