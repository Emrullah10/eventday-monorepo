import express from 'express';
import { baseMiddlewares, requestLogger } from '@everyday/middlewares';
import { handleErrors } from '@everyday/errors';
import { makeServiceDiscovery } from '@everyday/service-discovery';
import { buildContainer } from './container.js';
import { makeEventRoutes } from '../routes/event.routes.js';
import { makeInternalRoutes } from '../routes/internal.routes.js';
import { appConfig } from '../configs/app-config.js';

export const boot = async () => {
  const container = buildContainer();
  const app = express();

  app.use(...baseMiddlewares());
  app.use(requestLogger(container.logger));

  app.get('/health', (req, res) => res.json({ status: 'OK', service: 'everyday-service-event' }));
  app.use('/', makeEventRoutes(container));
  app.use('/internal', makeInternalRoutes(container));
  app.use(handleErrors);

  const port = appConfig.EVENT_PORT;
  const server = app.listen(port, () => {
    container.logger.info(`Listening on port ${port}`);
  });

  const discovery = makeServiceDiscovery({ redisUrl: appConfig.REDIS_URL });
  try {
    await discovery.registerService({
      serviceName: 'everyday-service-event',
      rootUrl: `http://localhost:${port}`,
      basePath: '/api/events',
    });
  } catch (error) {
    container.logger.warn('Service discovery registration failed (Redis unavailable?)', error.message);
  }

  return { app, server };
};
