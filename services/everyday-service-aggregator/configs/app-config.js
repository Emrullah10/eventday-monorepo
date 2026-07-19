import { loadConfig } from '@everyday/config';

export const appConfig = loadConfig({
  NODE_ENV: { default: 'development' },
  AGGREGATOR_PORT: { default: '5004' },
  REDIS_URL: { default: 'redis://localhost:6379' },
  EVENT_SERVICE_URL: { default: 'http://localhost:5002' },
  GEMINI_API_KEY: { default: '' },
});
