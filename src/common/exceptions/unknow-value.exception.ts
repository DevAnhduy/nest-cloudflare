import { HttpException, HttpStatus } from '@nestjs/common';

import { DatabaseExitCode, HttpExceptionMessage } from '@common/enums';
import { IHttpExceptionItem } from '@common/interfaces';

export class UnknowValueException extends HttpException {
  constructor(message?: string, errors?: IHttpExceptionItem[]) {
    super(
      {
        data: null,
        errorCode: DatabaseExitCode.UNKNOW_VALUE,
        message: message || HttpExceptionMessage.NULL_VALUE,
        errors: errors || [],
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
