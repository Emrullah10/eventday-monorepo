import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLogger } from '@everyday/middlewares';
import { handleErrors } from '@everyday/errors';
import { makeLogger } from '@everyday/helper';
import { buildAuthRouter, mountServiceProxies } from './route.js';
import { issueCsrfCookie } from './middlewares/csrf-middleware.js';
import { appConfig } from '../configs/app-config.js';

export const boot = async () => {
  const logger = makeLogger('everyday-web-gateway');
  const app = express();

  app.use(cors());
  app.use(cookieParser(appConfig.COOKIE_SECRET));
  app.use(requestLogger(logger));
  app.use(issueCsrfCookie);

  app.get('/health', (req, res) => res.json({ status: 'OK', service: 'everyday-web-gateway' }));

  // Proxied routes must be mounted BEFORE express.json() runs (it's scoped to
  // buildAuthRouter below) — a global body parser would consume the request
  // stream that http-proxy-middleware needs to pipe through untouched,
  // otherwise the target service hangs waiting for a body it never gets.
  mountServiceProxies(app);

  app.use('/api', express.json(), buildAuthRouter());
  app.use(handleErrors);

  const port = appConfig.GATEWAY_PORT;
  const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });

  return { app, server };
};
