const EventService = require('./event.service');
const db = require('../../common/database');

jest.mock('../../common/database', () => ({
  query: jest.fn(),
}));

describe('EventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockEventData = {
        title: 'React Bootcamp',
        description: 'Advanced React patterns',
        eventDate: '2024-01-01T10:00:00Z',
        location: 'Istanbul',
        eventType: 'BOOTCAMP',
        price: 0,
        quota: 50,
        organizerId: 'user-uuid'
      };

      const mockResponse = {
        rows: [{ id: 'event-uuid', ...mockEventData }]
      };

      db.query.mockResolvedValueOnce(mockResponse);

      const result = await EventService.createEvent(mockEventData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(mockEventData.title);
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' }
      ];

      db.query.mockResolvedValueOnce({ rows: mockEvents });

      const result = await EventService.getAllEvents();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Event 1');
    });
  });
});
