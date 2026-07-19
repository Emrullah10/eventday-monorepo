import { makeDatasource } from '@everyday/datasource';
import { buildBookingCore } from '@everyday/core-service-booking';
import { makeLogger } from '@everyday/helper';
import { datasourceConfig } from '../configs/datasource-config.js';

export const buildContainer = ({ connectionString = datasourceConfig.DATABASE_URL, translateHttpErrors = true } = {}) => {
  const { rawQuery, withTransaction } = makeDatasource({ connectionString });
  const logger = makeLogger('everyday-service-booking');
  const core = buildBookingCore({ rawQuery, withTransaction, translateHttpErrors });

  return { ...core, logger };
};
