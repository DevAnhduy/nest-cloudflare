import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';

import configuration from './r2.configuration';
import { R2ConfigService } from './r2.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        R2_ACCOUNT_ID: Joi.string().required(),
        R2_ACCESS_KEY_ID: Joi.string().required(),
        R2_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, R2ConfigService],
  exports: [ConfigService, R2ConfigService],
})
export class R2ConfigModule {}
