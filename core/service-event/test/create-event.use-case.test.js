import { jest, describe, it, expect } from '@jest/globals';
import { makeCreateEvent } from '../src/application/use-cases/create-event.use-case.js';

describe('createEvent use-case', () => {
  it('creates an event successfully', async () => {
    const mockEventData = {
      title: 'React Bootcamp',
      description: 'Advanced React patterns',
      eventDate: '2024-01-01T10:00:00Z',
      location: 'Istanbul',
      eventType: 'BOOTCAMP',
      price: 0,
      quota: 50,
      organizerId: 'user-uuid',
    };
    const eventRepo = { create: jest.fn().mockResolvedValue({ id: 'event-uuid', ...mockEventData }) };
    const createEvent = makeCreateEvent({ eventRepo });

    const result = await createEvent(mockEventData);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe(mockEventData.title);
  });
});
