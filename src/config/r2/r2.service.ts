import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class R2ConfigService {
  constructor(private configService: ConfigService) {}

  get accountId(): string {
    return this.configService.get<string>('r2.account_id');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('r2.access_key_id');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('r2.secret_access_key');
  }
}
