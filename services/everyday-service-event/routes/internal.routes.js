import { Router } from 'express';

/**
 * Service-to-service surface, called by the aggregator over the internal
 * network to dedupe and create externally-sourced events. Not proxied by the
 * gateway and not reachable from the public internet.
 */
export const makeInternalRoutes = ({ eventRepo, createEvent }) => {
  const router = Router();

  router.get('/events/by-external-id', async (req, res, next) => {
    try {
      const { externalId, source } = req.query;
      const event = await eventRepo.findByExternalId({ externalId, source });
      res.json(event);
    } catch (error) {
      next(error);
    }
  });

  router.post('/events', async (req, res, next) => {
    try {
      res.status(201).json(await createEvent(req.body));
    } catch (error) {
      next(error);
    }
  });

  return router;
};
