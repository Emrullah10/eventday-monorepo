import { makeDatasource } from '@everyday/datasource';
import { buildEventCore } from '@everyday/core-service-event';
import { makeLogger } from '@everyday/helper';
import { datasourceConfig } from '../configs/datasource-config.js';

export const buildContainer = ({ connectionString = datasourceConfig.DATABASE_URL, translateHttpErrors = true } = {}) => {
  const { rawQuery } = makeDatasource({ connectionString });
  const logger = makeLogger('everyday-service-event');
  const core = buildEventCore({ rawQuery, translateHttpErrors });

  return { ...core, logger };
};
