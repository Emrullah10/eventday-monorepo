const BookingService = require('./booking.service');
const db = require('../../common/database');

jest.mock('../../common/database', () => ({
  query: jest.fn(),
  pool: { query: jest.fn() }
}));

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a ticket successfully if quota is available', async () => {
      const mockBookingData = { userId: 'user-1', eventId: 'event-1' };

      // 1. Check event exists and quota
      db.query.mockResolvedValueOnce({ rows: [{ id: 'event-1', quota: 10 }] });
      // 2. Count existing tickets
      db.query.mockResolvedValueOnce({ rows: [{ count: 5 }] });
      // 3. Check duplicate ticket (Return empty to proceed)
      db.query.mockResolvedValueOnce({ rows: [] });
      // 4. Create ticket
      db.query.mockResolvedValueOnce({ rows: [{ id: 'ticket-1', ...mockBookingData }] });

      const result = await BookingService.createBooking(mockBookingData);

      expect(result).toHaveProperty('id');
      expect(require('../../common/database').query).toHaveBeenCalledTimes(4);
    });

    it('should throw error if event is full', async () => {
      const mockBookingData = { userId: 'user-1', eventId: 'event-1' };

      db.query.mockResolvedValueOnce({ rows: [{ id: 'event-1', quota: 5 }] });
      db.query.mockResolvedValueOnce({ rows: [{ count: 5 }] });

      await expect(BookingService.createBooking(mockBookingData)).rejects.toThrow('Event is full');
    });
  });
});
