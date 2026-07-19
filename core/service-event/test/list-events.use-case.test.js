import { jest, describe, it, expect } from '@jest/globals';
import { makeListEvents } from '../src/application/use-cases/list-events.use-case.js';

describe('listEvents use-case', () => {
  it('returns all events', async () => {
    const mockEvents = [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' },
    ];
    const eventRepo = { findAll: jest.fn().mockResolvedValue(mockEvents) };
    const listEvents = makeListEvents({ eventRepo });

    const result = await listEvents();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Event 1');
  });
});
