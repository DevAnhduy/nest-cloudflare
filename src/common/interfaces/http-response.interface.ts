import { HttpNoneResponse } from './http-none-response.interface';

export type HttpResponse<T> = HttpNoneResponse & {
  data: T[] | T | null;
};
