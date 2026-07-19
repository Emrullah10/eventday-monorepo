/**
 * Dedupes and persists a batch of externally-sourced events. `eventGateway`
 * is a port to the event service (findByExternalId/createEvent) — in the
 * monolith this reached the events table directly; here it crosses a
 * service boundary, so it's injected rather than imported.
 */
export const makeProcessSourceEvents = ({ eventGateway, aiAnalyst, logger }) => async (events, sourceName) => {
  const stats = { added: 0, skipped: 0, autoPublished: 0, sentToDraft: 0 };

  for (const eventData of events) {
    const existing = await eventGateway.findByExternalId({ externalId: eventData.externalId, source: sourceName });
    if (existing) {
      stats.skipped++;
      continue;
    }

    const aiResult = await aiAnalyst.evaluate(eventData);
    const status = aiResult.approved ? 'PUBLISHED' : 'DRAFT';

    await eventGateway.createEvent({
      ...eventData,
      status,
      source: sourceName,
      description: `[AI CONFIDENCE: ${(aiResult.confidence * 100).toFixed(0)}%] ${eventData.description}\n[AI NOTE]: ${aiResult.reason}`,
      organizerId: null,
    });

    stats.added++;
    if (status === 'PUBLISHED') stats.autoPublished++;
    else stats.sentToDraft++;
  }

  logger?.info('Sync stats', stats);
  return stats;
};
