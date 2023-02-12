import { Module } from '@nestjs/common';

import { R2Module } from './r2/r2.module';

@Module({
  imports: [R2Module],
})
export class RootModule {}
