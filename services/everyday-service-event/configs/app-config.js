import { loadConfig } from '@everyday/config';

export const appConfig = loadConfig({
  NODE_ENV: { default: 'development' },
  EVENT_PORT: { default: '5002' },
  REDIS_URL: { default: 'redis://localhost:6379' },
});
