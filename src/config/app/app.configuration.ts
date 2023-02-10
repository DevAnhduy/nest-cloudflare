import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.ENV,
  port: process.env.PORT,
  origin: process.env.ORIGIN,
}));
