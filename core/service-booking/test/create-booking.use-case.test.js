import { jest, describe, it, expect } from '@jest/globals';
import { makeCreateBooking } from '../src/application/use-cases/create-booking.use-case.js';
import { EventFullError } from '../src/domain/errors/index.js';

describe('createBooking use-case', () => {
  it('creates a ticket when the repository reports success', async () => {
    const bookingRepo = { createTicket: jest.fn().mockResolvedValue({ ticket: { id: 'ticket-1', user_id: 'user-1', event_id: 'event-1' } }) };
    const createBooking = makeCreateBooking({ bookingRepo });

    const result = await createBooking({ userId: 'user-1', eventId: 'event-1' });

    expect(result).toHaveProperty('id', 'ticket-1');
    expect(bookingRepo.createTicket).toHaveBeenCalledWith({ userId: 'user-1', eventId: 'event-1' });
  });

  it('throws EventFullError when the repository reports EVENT_FULL', async () => {
    const bookingRepo = { createTicket: jest.fn().mockResolvedValue({ error: 'EVENT_FULL' }) };
    const createBooking = makeCreateBooking({ bookingRepo });

    await expect(createBooking({ userId: 'user-1', eventId: 'event-1' })).rejects.toBeInstanceOf(EventFullError);
  });
});
