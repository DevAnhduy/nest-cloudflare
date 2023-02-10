import { Bucket } from 'aws-sdk/clients/s3';

import { returnObjects } from '@common/helpers/response';
import { HttpResponse } from '@common/interfaces';

import {
  IBucketPagingResponse,
  IBucketResponse,
} from '../../interfaces/bucket/responses/get-buckets.interface';
import { convertToResponse, convertToResponses } from '../../transforms/bucket';

export const returnObjectsWithPaging = <T>(
  amount: number,
  pages: number,
  page: number,
  data: T | T[] | null,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
): IBucketPagingResponse<T> => {
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

export const generateBucketsResponse = async (
  count: number,
  pages: number,
  page: number,
  buckets: Bucket[],
): Promise<IBucketPagingResponse<IBucketResponse>> => {
  const payload = convertToResponses(buckets);

  return returnObjectsWithPaging(count, pages, page, payload);
};

export const generateBucketResponse = async (
  bucket: Bucket | null,
): Promise<HttpResponse<IBucketResponse> | null> => {
  const payload = convertToResponse(bucket);

  // Returns object
  return returnObjects<IBucketResponse>(payload);
};
