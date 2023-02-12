export type HttpNoneResponse = {
  errorCode: number;
  message: string | null;
  errors:
    | { [key: string]: string | { [key: string]: string }[] }
    | { [key: string]: string | { [key: string]: string }[] }[]
    | null;
};
