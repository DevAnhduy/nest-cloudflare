import { Injectable } from '@nestjs/common';

import * as S3 from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';

import { convertToSlug } from '@common/helpers/string';
import { R2ConfigService } from '@config/r2/r2.service';

import { genR2EndPoint } from '../../utils';

@Injectable()
export class BucketService {
  s3Client: S3 = null;
  constructor(private readonly _r2Config: R2ConfigService) {
    this.s3Client = new S3({
      endpoint: genR2EndPoint(this._r2Config.accountId),
      credentials: {
        accessKeyId: this._r2Config.accessKeyId,
        secretAccessKey: this._r2Config.secretAccessKey,
      },
    });
  }

  async getAll(): Promise<PromiseResult<S3.ListBucketsOutput, AWSError>> {
    const response = await this.s3Client.listBuckets().promise();

    return response;
  }

  async create(
    name: string,
  ): Promise<PromiseResult<S3.CreateBucketOutput, AWSError>> {
    const params: S3.CreateBucketRequest = {
      Bucket: convertToSlug(name),
    };

    const response = await this.s3Client.createBucket(params).promise();

    return response;
  }

  async detele(name: string): Promise<any> {
    const params: S3.DeleteBucketRequest = {
      Bucket: name,
    };

    const response = await this.s3Client.deleteBucket(params).promise();

    return response;
  }
}
