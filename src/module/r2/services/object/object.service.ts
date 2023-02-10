import { Injectable } from '@nestjs/common';

import * as S3 from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Readable } from 'stream';

import { R2ConfigService } from '@config/r2/r2.service';

import { genR2EndPoint } from '../../utils';

@Injectable()
export class ObjectService {
  s3Client: S3 = null;
  constructor(private readonly _r2Config: R2ConfigService) {
    this.s3Client = new S3({
      endpoint: genR2EndPoint(this._r2Config.accountId),
      credentials: {
        accessKeyId: this._r2Config.accessKeyId,
        secretAccessKey: this._r2Config.secretAccessKey,
      },
      signatureVersion: 'v4',
    });
  }

  async getAll(
    bucket_name: string,
  ): Promise<PromiseResult<S3.ListObjectsOutput, AWSError>> {
    const response = await this.s3Client
      .listObjects({
        Bucket: bucket_name,
      })
      .promise();

    return response;
  }

  async serve(key: string, bucket_name: string): Promise<S3.GetObjectOutput> {
    const response = await this.getOne(key, bucket_name);

    return response;
  }

  async getOne(
    key: string,
    bucket_name: string,
  ): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    const response = await this.s3Client
      .getObject({
        Key: key,
        Bucket: bucket_name,
      })
      .promise();

    return response;
  }

  async create(
    bucket_name: string,
    file: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    const file_stream = Readable.from(file.buffer);

    const params: S3.PutObjectRequest = {
      Bucket: bucket_name,
      Key: file.originalname,
      Body: file_stream,
      ContentType: file.mimetype,
    };

    const response = await this.s3Client.upload(params).promise();

    return response;
  }

  async createPublicUrl(
    key: string,
    bucket_name: string,
    options: {
      expires?: number;
    } = {},
  ): Promise<string> {
    const params = {
      Bucket: bucket_name,
      Key: key,
      Expires: options.expires,
    };

    const response = await this.s3Client.getSignedUrlPromise(
      'getObject',
      params,
    );

    return response;
  }

  async delete(
    key: string,
    bucket_name: string,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const params: S3.DeleteObjectRequest = {
      Key: key,
      Bucket: bucket_name,
    };

    const response = await this.s3Client.deleteObject(params).promise();

    console.log(response.$response);

    return response;
  }
}
