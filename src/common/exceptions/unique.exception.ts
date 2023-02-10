import { HttpException, HttpStatus } from '@nestjs/common';

import { HttpExceptionMessage, ValidationExitCode } from '@common/enums';
import { IHttpExceptionItem } from '@common/interfaces';

export class UniqueException extends HttpException {
  constructor(message?: string, errors?: IHttpExceptionItem[]) {
    super(
      {
        data: null,
        errorCode: ValidationExitCode.UNIQUE_VALUE,
        message: message || HttpExceptionMessage.UNIQUE_VALUE,
        errors: errors || [],
      },
      HttpStatus.CONFLICT,
    );
  }
}
