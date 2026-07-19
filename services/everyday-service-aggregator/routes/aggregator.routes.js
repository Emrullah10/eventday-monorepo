import { Router } from 'express';
import { requireAdminHeaders } from '../src/require-admin-headers.js';

export const makeAggregatorRoutes = ({ syncAll }) => {
  const router = Router();

  // Manual trigger for the sync; in production this should also run as a
  // scheduled job (see original comment in the monolith's aggregator route).
  router.post('/sync', requireAdminHeaders, async (req, res, next) => {
    try {
      const results = await syncAll();
      res.json({ message: 'Sync completed successfully', results });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
