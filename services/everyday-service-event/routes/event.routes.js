import { Router } from 'express';
import { requireIdentityHeaders } from '../src/require-identity-headers.js';

/**
 * The gateway authenticates requests and forwards the verified user as
 * x-user-id / x-user-role headers (see MONOREPO-ARCHITECTURE-TEMPLATE.md §5
 * — auth lives only in the gateway, downstream services trust its headers).
 */
export const makeEventRoutes = ({ createEvent, listEvents, getEventById, getPendingEvents, updateEventStatus, editAndApproveEvent }) => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      res.json(await listEvents());
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      res.json(await getEventById(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  router.post('/', requireIdentityHeaders, async (req, res, next) => {
    try {
      const eventData = { ...req.body, organizerId: req.user.id };
      res.status(201).json(await createEvent(eventData));
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/pending', requireIdentityHeaders, async (req, res, next) => {
    try {
      res.json(await getPendingEvents(req.user.role));
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/:id/approve', requireIdentityHeaders, async (req, res, next) => {
    try {
      res.json(await updateEventStatus({ actorRole: req.user.role, eventId: req.params.id, status: 'PUBLISHED' }));
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/:id/reject', requireIdentityHeaders, async (req, res, next) => {
    try {
      res.json(await updateEventStatus({ actorRole: req.user.role, eventId: req.params.id, status: 'REJECTED' }));
    } catch (error) {
      next(error);
    }
  });

  router.put('/admin/:id', requireIdentityHeaders, async (req, res, next) => {
    try {
      res.json(await editAndApproveEvent({ actorRole: req.user.role, eventId: req.params.id, data: req.body }));
    } catch (error) {
      next(error);
    }
  });

  return router;
};
