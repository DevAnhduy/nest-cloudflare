import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { HttpResponse } from '@common/interfaces/http-response.interface';
import { DeleteObjectDto } from '@module/r2/dto/object/delete-object.dto';

import { AddObjectDto } from '../../dto/object/add-object.dto';
import { GenPublicUrlDto } from '../../dto/object/gen-public-url.dto';
import { GetObjectsDto } from '../../dto/object/get-objects.dto';
import { IObjectResponse } from '../../interfaces/object/responses/get-object.interface';
import { IObjectPagingResponse } from '../../interfaces/object/responses/get-objects.interface';
import { ObjectService } from '../../services/object/object.service';
import {
  generateObjectResponse,
  generateObjectsResponse,
} from '../../utils/object';

@Controller('r2/objects')
export class ObjectController {
  constructor(private readonly _objectService: ObjectService) {}

  @Get('serve/:bucket_name/:key')
  @HttpCode(HttpStatus.OK)
  async serveFile(
    @Param('bucket_name') bucket_name: string,
    @Param('key') key: string,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this._objectService.serve(key, bucket_name);

    res.attachment(key);
    res.type(response.ContentType);
    res.send(response.Body);

    return response.Body;
  }

  @Post('all')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Body() params: GetObjectsDto,
  ): Promise<IObjectPagingResponse<IObjectResponse>> {
    const response = await this._objectService.getAll(params.bucket_name);

    const count = response.Contents.length;
    const pages = 1;
    const page = 1;
    const data = response.Contents;

    return generateObjectsResponse(count, pages, page, data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() params: AddObjectDto,
  ): Promise<HttpResponse<IObjectResponse> | HttpException> {
    if (!file) {
      return new BadRequestException();
    }

    const result = await this._objectService.create(params.bucket_name, file);

    return generateObjectResponse(result);
  }

  @Post('public')
  @HttpCode(HttpStatus.CREATED)
  async createPublicUrl(
    @Body() params: GenPublicUrlDto,
  ): Promise<HttpResponse<IObjectResponse>> {
    const result = await this._objectService.createPublicUrl(
      params.key,
      params.bucket_name,
      {
        expires: params.expire_time || 0,
      },
    );

    return generateObjectResponse(null, result);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(
    @Body() params: DeleteObjectDto,
  ): Promise<HttpResponse<IObjectResponse>> {
    const { key, bucket_name } = params;

    await this._objectService.getOne(key, bucket_name);

    await this._objectService.delete(params.key, params.bucket_name);

    return generateObjectResponse({
      Bucket: params.bucket_name,
      Key: params.key,
      ETag: null,
      Location: null,
    });
  }
}
