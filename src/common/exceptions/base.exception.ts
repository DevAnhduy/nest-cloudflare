import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  DatabaseExitCode,
  LogLevel,
  ServerExitCode,
  TypeormErrorCode,
  ValidationExitCode,
} from '@common/enums';
import { QueryFailedError, TypeORMError } from 'typeorm';

import { HttpExceptionMessage } from '@common/enums';
import { REGEX_HANDLE_UNIQUE_ERROR_TYPE_ORM } from '@common/regexs/type-orm.regex';
import { LogService } from '@log/log.service';

import { IErrorResponse } from '../interfaces/error-field.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private _logger = new LogService();

  catch(exception: HttpException, host: ArgumentsHost): any {
    //#region Console Logging
    console.log(exception);

    //#endregion

    //#region Get Exception
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const data = null;

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (<any>exception).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception?.message || HttpExceptionMessage.INTERNAL_SERVER_ERROR;

    let errors: IErrorResponse | string | object = null;

    let errorCode: number = ServerExitCode.INTERNAL_SERVER_ERROR;
    //#endregion

    //#region TypeORM Query Error
    if (exception instanceof TypeORMError) {
      const queryError: QueryFailedError = <QueryFailedError>(
        (<unknown>exception)
      );

      if (queryError?.driverError?.routine) {
        switch (queryError.driverError.routine) {
          // Unique Exception
          case TypeormErrorCode.UNIQUE:
            const errorTransformed = REGEX_HANDLE_UNIQUE_ERROR_TYPE_ORM.exec(
              queryError?.driverError?.detail,
            );

            status = HttpStatus.CONFLICT;
            errorCode = ValidationExitCode.UNIQUE_VALUE;
            message = HttpExceptionMessage.UNIQUE_VALUE;

            errors[errorTransformed[1]] = message;

            break;
          // Constraint Exception
          case TypeormErrorCode.CONSTRANT:
            status = HttpStatus.BAD_REQUEST;
            errorCode = ValidationExitCode.MISSING_FIELD;
            message = queryError?.driverError?.column + ' không được null';

            errors[queryError.driverError?.column] =
              HttpExceptionMessage.NULL_VALUE;

          // Unknown Error
          default:
            console.log(exception);
        }
      }
    }
    //#endregion

    //#region Validation Error
    let responseData: any;

    if (status === HttpStatus.NOT_FOUND) {
      errorCode = DatabaseExitCode.UNKNOW_VALUE;
    }

    if (
      status === HttpStatus.BAD_REQUEST &&
      typeof exception.getResponse === 'function'
    ) {
      responseData = <any[]>exception?.getResponse();
    }

    //#endregion

    //#region Bad Request from DTO Validation
    if (status === HttpStatus.BAD_REQUEST && responseData?.length) {
      errorCode = ValidationExitCode.MISSING_FIELD;
      errors = {};
      message = null;

      const validationError: any[] = responseData?.filter(
        (err: any) => err instanceof ValidationError,
      );

      if (validationError?.length) {
        validationError?.forEach((error) => {
          const validationFormated = {};

          validationFormated['key'] = error?.property;

          if (error?.constraints) {
            validationFormated['value'] = Object.values(error?.constraints)[0];
          } else {
            validationFormated['value'] = '';
          }

          // Validation array
          if (error?.children?.length) {
            validationFormated['child'] = {};

            error?.children?.forEach((err: any) => {
              err?.children?.forEach((errChild: any) => {
                if (!validationFormated['child'][err?.property]) {
                  validationFormated['child'][err?.property] = {
                    [errChild?.property]: Object.values(
                      errChild?.constraints,
                    )[0],
                  };
                } else {
                  validationFormated['child'][err?.property] = {
                    ...validationFormated['child'][err?.property],
                    [errChild?.property]: Object.values(
                      errChild?.constraints,
                    )[0],
                  };
                }
              });
            });
          }

          return (errors[validationFormated['key']] =
            validationFormated['value']);
        });
      }
    }
    //#endregion

    //#region Bad Request from Bad Request Exception
    if (status === HttpStatus.BAD_REQUEST && !responseData?.length) {
      errorCode = ValidationExitCode.MISSING_FIELD;

      errors = responseData?.errors || null;
    }
    //#endregion

    //#region Logging
    this._logger.writeLog(
      LogLevel.ERROR,
      request.method,
      request.url,
      message || JSON.stringify(errors),
    );
    //#endregion

    //#region Return Response
    return response.status(status).send({
      errorCode: errorCode,
      data,
      message,
      errors,
    });
    //#endregion
  }
}
