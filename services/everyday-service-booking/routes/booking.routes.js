import { Router } from 'express';
import { requireIdentityHeaders } from '../src/require-identity-headers.js';

export const makeBookingRoutes = ({ createBooking, getUserTickets }) => {
  const router = Router();

  router.post('/', requireIdentityHeaders, async (req, res, next) => {
    try {
      const { eventId } = req.body;
      if (!eventId) return res.status(400).json({ message: 'Event ID is required' });

      const ticket = await createBooking({ userId: req.user.id, eventId });
      res.status(201).json({ ticket });
    } catch (error) {
      next(error);
    }
  });

  // Always the authenticated caller's own tickets — no :userId param, closing
  // the old "trust req.body/req.params for identity" gap.
  router.get('/my', requireIdentityHeaders, async (req, res, next) => {
    try {
      res.json(await getUserTickets(req.user.id));
    } catch (error) {
      next(error);
    }
  });

  return router;
};
