import { Module } from '@nestjs/common';

import { R2ConfigModule } from '@config/r2/r2.module';

import { BucketController } from './controllers/bucket/bucket.controller';
import { ObjectController } from './controllers/object/object.controller';
import { ObjectService } from './services/object/object.service';
import { BucketService } from './services/bucket/bucket.service';

@Module({
  imports: [R2ConfigModule],
  controllers: [BucketController, ObjectController],
  providers: [BucketService, ObjectService],
})
export class R2Module {}
