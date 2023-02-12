import { Buckets, Bucket } from 'aws-sdk/clients/s3';

import { formatDate } from '@common/helpers/date';

import { IBucketResponse } from '../../interfaces/bucket/responses/get-buckets.interface';

export const convertToResponses = (buckets: Buckets) => {
  const payload: IBucketResponse[] = [];

  if (buckets) {
    buckets.forEach((bucket) => {
      const item: IBucketResponse = {
        name: bucket.Name,
        created_at: bucket.CreationDate && formatDate(bucket.CreationDate),
      };

      payload.push(item);
    });
  }

  return payload;
};

export const convertToResponse = (bucket: Bucket) => {
  const payload: IBucketResponse = {
    name: bucket.Name,
    created_at: bucket.CreationDate && formatDate(bucket.CreationDate),
  };

  return payload;
};
