import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get port(): number {
    return this.configService.get<number>('app.port');
  }

  get origin(): string {
    return this.configService.get<string>('app.origin');
  }
}
