import { jest, describe, it, expect } from '@jest/globals';
import { makeBookingRepository } from '../src/infrastructure/persistence/repositories/booking.repository.js';

/** Fake withTransaction that just runs fn against a mock `query`, mirroring @everyday/datasource's contract. */
const makeFakeTransaction = (query) => (fn) => fn({ query });

describe('bookingRepository.createTicket', () => {
  it('creates a ticket when quota is available and no duplicate exists', async () => {
    const query = jest.fn()
      .mockResolvedValueOnce({ rows: [{ id: 'event-1', quota: 10 }] }) // lock + fetch event
      .mockResolvedValueOnce({ rows: [{ count: 5 }] }) // confirmed count
      .mockResolvedValueOnce({ rows: [] }) // duplicate check
      .mockResolvedValueOnce({ rows: [{ id: 'ticket-1', user_id: 'user-1', event_id: 'event-1' }] }); // insert

    const bookingRepo = makeBookingRepository({ rawQuery: jest.fn(), withTransaction: makeFakeTransaction(query) });

    const result = await bookingRepo.createTicket({ userId: 'user-1', eventId: 'event-1' });

    expect(result.ticket).toHaveProperty('id', 'ticket-1');
    expect(query).toHaveBeenCalledTimes(4);
  });

  it('reports EVENT_FULL without inserting when quota is reached', async () => {
    const query = jest.fn()
      .mockResolvedValueOnce({ rows: [{ id: 'event-1', quota: 5 }] })
      .mockResolvedValueOnce({ rows: [{ count: 5 }] });

    const bookingRepo = makeBookingRepository({ rawQuery: jest.fn(), withTransaction: makeFakeTransaction(query) });

    const result = await bookingRepo.createTicket({ userId: 'user-1', eventId: 'event-1' });

    expect(result.error).toBe('EVENT_FULL');
    expect(query).toHaveBeenCalledTimes(2);
  });
});
