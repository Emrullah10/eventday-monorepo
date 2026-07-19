import { loadConfig } from '@everyday/config';

export const appConfig = loadConfig({
  NODE_ENV: { default: 'development' },
  IDENTITY_PORT: { default: '5001' },
  REDIS_URL: { default: 'redis://localhost:6379' },
});
