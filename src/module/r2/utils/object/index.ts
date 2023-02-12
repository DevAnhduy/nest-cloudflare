import { ManagedUpload } from 'aws-sdk/clients/s3';
import { ObjectList } from 'aws-sdk/clients/s3';

import { returnObjects } from '@common/helpers/response';
import { HttpResponse } from '@common/interfaces';

import { IObjectResponse } from '../../interfaces/object/responses/get-object.interface';
import { IObjectPagingResponse } from '../../interfaces/object/responses/get-objects.interface';
import { convertToResponse, convertToResponses } from '../../transforms/object';

export const returnObjectsWithPaging = <T>(
  amount: number,
  pages: number,
  page: number,
  data: T | T[] | null,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
): IObjectPagingResponse<T> => {
  return {
    data: {
      pages,
      page,
      amount,
      data,
    },
    errorCode: data != null ? 0 : errorCode ?? 9001,
    message: data !== null ? null : message,
    errors: errors ?? null,
  };
};

export const generateObjectsResponse = async (
  count: number,
  pages: number,
  page: number,
  objects: ObjectList,
): Promise<IObjectPagingResponse<IObjectResponse>> => {
  const payload = convertToResponses(objects);

  return returnObjectsWithPaging(count, pages, page, payload);
};

export const generateObjectResponse = async (
  object: ManagedUpload.SendData | null,
  url?: string,
): Promise<HttpResponse<IObjectResponse>> => {
  const payload = convertToResponse(object, url);

  return returnObjects<IObjectResponse>(payload);
};
