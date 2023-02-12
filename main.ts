import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@nestjs/common';
import { APP_FILTER, NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from '@common/exceptions';
import { LoggerInterceptor } from '@common/interceptors/logger.interceptor';
import { AppConfigService } from '@config/app/app.service';

import { AppModule } from './src/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = app.get(AppConfigService);

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (
        validationErrors: ValidationError[] = [],
      ): HttpException => {
        return new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
      },
    }),
  );

  await app.listen(appConfig.port);
}
bootstrap();
