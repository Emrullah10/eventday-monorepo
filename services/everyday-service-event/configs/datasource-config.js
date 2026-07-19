import { loadConfig } from '@everyday/config';

export const datasourceConfig = loadConfig({
  DATABASE_URL: { required: true },
});
