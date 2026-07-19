import { jest, describe, it, expect } from '@jest/globals';
import { makeProcessSourceEvents } from '../src/application/use-cases/process-source-events.use-case.js';

describe('processSourceEvents use-case', () => {
  it('skips events that already exist and creates new ones with AI-derived status', async () => {
    const events = [
      { title: 'New Event', description: 'desc', externalId: 'ext-1' },
      { title: 'Existing Event', description: 'desc', externalId: 'ext-2' },
    ];
    const eventGateway = {
      findByExternalId: jest.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'existing-id' }),
      createEvent: jest.fn().mockResolvedValue({ id: 'created-id' }),
    };
    const aiAnalyst = { evaluate: jest.fn().mockResolvedValue({ approved: true, confidence: 0.9, reason: 'Looks legit' }) };

    const processSourceEvents = makeProcessSourceEvents({ eventGateway, aiAnalyst, logger: undefined });
    const stats = await processSourceEvents(events, 'TestSource');

    expect(stats).toEqual({ added: 1, skipped: 1, autoPublished: 1, sentToDraft: 0 });
    expect(eventGateway.createEvent).toHaveBeenCalledTimes(1);
    expect(eventGateway.createEvent.mock.calls[0][0].status).toBe('PUBLISHED');
  });

  it('sends non-approved events to DRAFT', async () => {
    const events = [{ title: 'Sketchy Event', description: 'desc', externalId: 'ext-3' }];
    const eventGateway = {
      findByExternalId: jest.fn().mockResolvedValue(null),
      createEvent: jest.fn().mockResolvedValue({ id: 'created-id' }),
    };
    const aiAnalyst = { evaluate: jest.fn().mockResolvedValue({ approved: false, confidence: 0.3, reason: 'Unclear' }) };

    const processSourceEvents = makeProcessSourceEvents({ eventGateway, aiAnalyst, logger: undefined });
    const stats = await processSourceEvents(events, 'TestSource');

    expect(stats).toEqual({ added: 1, skipped: 0, autoPublished: 0, sentToDraft: 1 });
    expect(eventGateway.createEvent.mock.calls[0][0].status).toBe('DRAFT');
  });
});
