import { makeDatasource } from '@everyday/datasource';
import { buildIdentityCore } from '@everyday/core-service-identity';
import { makeLogger } from '@everyday/helper';
import { datasourceConfig } from '../configs/datasource-config.js';

/**
 * Composition root: wires the framework-free identity core to a concrete
 * Postgres connection. See MONOREPO-ARCHITECTURE-TEMPLATE.md §3.2 —
 * `translateHttpErrors: false` is used by tests that want to see raw domain
 * errors instead of HTTP-shaped ones.
 */
export const buildContainer = ({ connectionString = datasourceConfig.DATABASE_URL, translateHttpErrors = true } = {}) => {
  const { rawQuery } = makeDatasource({ connectionString });
  const logger = makeLogger('everyday-service-identity');
  const core = buildIdentityCore({ rawQuery, translateHttpErrors });

  return { ...core, logger };
};
