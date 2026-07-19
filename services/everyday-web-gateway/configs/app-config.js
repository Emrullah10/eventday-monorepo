import { loadConfig } from '@everyday/config';

export const appConfig = loadConfig({
  NODE_ENV: { default: 'development' },
  GATEWAY_PORT: { default: '5000' },
  REDIS_URL: { default: 'redis://localhost:6379' },
  JWT_SECRET: { required: true },
  JWT_EXPIRES_IN: { default: '1d' },
  COOKIE_SECRET: { required: true },
  IDENTITY_SERVICE_URL: { default: 'http://localhost:5001' },
  EVENT_SERVICE_URL: { default: 'http://localhost:5002' },
  BOOKING_SERVICE_URL: { default: 'http://localhost:5003' },
  AGGREGATOR_SERVICE_URL: { default: 'http://localhost:5004' },
});
