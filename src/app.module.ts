import { Module } from '@nestjs/common';

import { ConfigRootModule } from '@config/index.module';
import { RootModule } from '@module/index.module';

@Module({
  imports: [ConfigRootModule, RootModule],
})
export class AppModule {}
