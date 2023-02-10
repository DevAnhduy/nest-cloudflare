import { registerAs } from '@nestjs/config';

export default registerAs('r2', () => ({
  account_id: process.env.R2_ACCOUNT_ID,
  access_key_id: process.env.R2_ACCESS_KEY_ID,
  secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
}));
