import { HttpNoneResponse } from '@common/interfaces/http-none-response.interface';

export interface IBucketResponse {
  name: string;

  created_at: string;
}

export type IBucketPagingResponse<T> = HttpNoneResponse & {
  data: {
    pages: number | null;
    page: number | null;
    amount: number;
    data: T[] | T | null;
  };
};
