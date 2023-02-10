import { ManagedUpload, ObjectList } from 'aws-sdk/clients/s3';

import { formatDate } from '@common/helpers/date';

import { IObjectResponse } from '../../interfaces/object/responses/get-object.interface';

export const convertToResponses = (objects: ObjectList): IObjectResponse[] => {
  const payload: IObjectResponse[] = [];

  if (objects) {
    objects.forEach((object) => {
      const item: IObjectResponse = {
        key: object.Key,
        e_tag: object.ETag,
        size: object.Size,
        storage_class: object.StorageClass,
        updated_at: formatDate(object.LastModified),
      };

      payload.push(item);
    });
  }

  return payload;
};

export const convertToResponse = (
  object: ManagedUpload.SendData | null,
  url?: string,
): IObjectResponse | null => {
  const payload: IObjectResponse = {};

  if (object) {
    payload.key = object.Key;
    payload.e_tag = object.ETag;
  }

  if (url) {
    payload.url = url;
  }

  return payload;
};
