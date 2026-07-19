import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { makeGatewayHandlers } from './gateway-handlers.js';
import { authMiddleware, optionalAuthMiddleware } from './middlewares/auth-middleware.js';
import { conditionalCsrfProtection } from './middlewares/csrf-middleware.js';
import { strictAuthLimiter } from './middlewares/security-middleware.js';
import { appConfig } from '../configs/app-config.js';

/**
 * Injects the verified user as x-user-id / x-user-role headers before
 * forwarding to a downstream service, so that service can trust identity
 * without re-verifying the JWT (see MONOREPO-ARCHITECTURE-TEMPLATE.md §5).
 * Proxies are mounted before any body-parser (see boot.js), so the request
 * stream is piped through untouched — no re-serialization needed here.
 */
const onProxyReq = (proxyReq, req) => {
  if (req.user) {
    proxyReq.setHeader('x-user-id', req.user.id);
    proxyReq.setHeader('x-user-role', req.user.role ?? '');
  }
};

/**
 * Proxies are mounted directly on the top-level app (not nested inside a
 * sub-router) at their full external path, and pathRewrite strips that same
 * prefix. Nesting createProxyMiddleware inside a router.use(prefix, ...)
 * caused it to silently decline to proxy (fell through to Express's own 404)
 * because its internal path matching works off the original mount path, not
 * the already-stripped req.url a nested router hands it.
 */
const makeServiceProxy = ({ target, prefix }) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${prefix}`]: '' },
    onProxyReq,
  });

export const buildAuthRouter = () => {
  const router = Router();
  const handlers = makeGatewayHandlers();

  router.post('/gateway/register', strictAuthLimiter, conditionalCsrfProtection, handlers.register);
  router.post('/gateway/login', strictAuthLimiter, conditionalCsrfProtection, handlers.login);
  router.post('/gateway/logout', authMiddleware, handlers.logout);
  router.get('/gateway/me', authMiddleware, handlers.me);

  return router;
};

/** Mounts the three downstream proxies directly on `app` at their full path. */
export const mountServiceProxies = (app) => {
  // Events: public GET, authenticated POST/admin — the event service itself
  // enforces role checks; the gateway just forwards verified identity.
  app.use('/api/events', optionalAuthMiddleware, conditionalCsrfProtection, makeServiceProxy({
    target: appConfig.EVENT_SERVICE_URL,
    prefix: '/api/events',
  }));

  app.use('/api/bookings', authMiddleware, conditionalCsrfProtection, makeServiceProxy({
    target: appConfig.BOOKING_SERVICE_URL,
    prefix: '/api/bookings',
  }));

  app.use('/api/aggregator', authMiddleware, conditionalCsrfProtection, makeServiceProxy({
    target: appConfig.AGGREGATOR_SERVICE_URL,
    prefix: '/api/aggregator',
  }));
};
