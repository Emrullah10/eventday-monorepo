import cors from 'cors';
import express from 'express';

/** Standard middleware stack every service (except the gateway) boots with. */
export const baseMiddlewares = () => [cors(), express.json()];

/** Simple request logger: method, path, status, duration. */
export const requestLogger = (logger) => (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
};
