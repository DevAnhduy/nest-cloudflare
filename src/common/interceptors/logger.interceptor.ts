import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CallHandler } from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common';

import { Observable, tap } from 'rxjs';

import { LogLevel } from '@common/enums';
import { getDateNow } from '@common/helpers/date';
import { writeFile } from '@log/log.util';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { ip, url, method } = request;
    const dateNow = getDateNow();
    const userAgent = request.headers['user-agent'] || '';
    const requestData = `[${
      LogLevel.INFO
    }] [REQUEST] ${dateNow.toISOString()}: [${userAgent} ${ip}] [${method} ${url}] \r\n`;

    writeFile(LogLevel.INFO, requestData);

    return next.handle().pipe(
      tap({
        next: (value) => {
          const responseData = `[${
            LogLevel.INFO
          }] [RESPONSE] ${dateNow.toISOString()}: [${userAgent} ${ip}] [${method} ${url}] ${JSON.stringify(
            value?.data,
          )} \r\n`;

          this.logger.log(responseData);

          writeFile(LogLevel.INFO, responseData);
        },
        error: (err) => {
          if (!(err instanceof HttpException)) {
            const responseData = `[${
              LogLevel.ERROR
            }] [RESPONSE] ${dateNow.toISOString()}: [${userAgent} ${ip}] [${method} ${url}] ${JSON.stringify(
              err,
            )} \r\n`;

            this.logger.error(responseData);

            writeFile(LogLevel.ERROR, responseData);
          }
        },
      }),
    );
  }
}
