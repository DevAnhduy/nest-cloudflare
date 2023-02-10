import { Module } from '@nestjs/common';

import { AppConfigModule } from './app/app.module';
import { R2ConfigModule } from './r2/r2.module';

@Module({
  imports: [AppConfigModule, R2ConfigModule],
})
export class ConfigRootModule {}
