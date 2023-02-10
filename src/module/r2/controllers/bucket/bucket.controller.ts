import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Param } from '@nestjs/common';

import { Bucket } from 'aws-sdk/clients/s3';

import { HttpResponse } from '@common/interfaces';

import { AddBucketDto } from '../../dto/bucket/add-bucket.dto';
import {
  IBucketPagingResponse,
  IBucketResponse,
} from '../../interfaces/bucket/responses/get-buckets.interface';
import { BucketService } from '../../services/bucket/bucket.service';
import {
  generateBucketResponse,
  generateBucketsResponse,
} from '../../utils/bucket';

@Controller('r2/buckets')
export class BucketController {
  constructor(private readonly _bucketService: BucketService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<IBucketPagingResponse<IBucketResponse>> {
    const response = await this._bucketService.getAll();

    const count = response.Buckets.length;
    const pages = 1;
    const page = 1;
    const data = response.Buckets;

    return generateBucketsResponse(count, pages, page, data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() params: AddBucketDto,
  ): Promise<HttpResponse<IBucketResponse>> {
    await this._bucketService.create(params.name);

    const response: Bucket = {
      Name: params.name,
      CreationDate: new Date(),
    };

    return generateBucketResponse(response);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.OK)
  async deleteBucket(
    @Param('name') name: string,
  ): Promise<HttpResponse<IBucketResponse>> {
    await this._bucketService.detele(name);

    const response: Bucket = {
      Name: name,
    };

    return generateBucketResponse(response);
  }
}
