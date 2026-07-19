import { loadConfig } from '@everyday/config';

export const appConfig = loadConfig({
  NODE_ENV: { default: 'development' },
  BOOKING_PORT: { default: '5003' },
  REDIS_URL: { default: 'redis://localhost:6379' },
});
