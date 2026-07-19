/**
 * HTTP client for the event service, used to create events discovered by the
 * aggregator and check for existing ones by (externalId, source). This
 * service doesn't own the events table — it can't, once event/aggregator
 * are separate deployable services — so it talks to service-event over HTTP
 * instead of importing its repository directly.
 */
export const makeEventServiceGateway = ({ httpClient, eventServiceUrl }) => ({
  findByExternalId: async ({ externalId, source }) => {
    const { data } = await httpClient.get(`${eventServiceUrl}/internal/events/by-external-id`, {
      params: { externalId, source },
    });
    return data ?? null;
  },

  createEvent: async (eventData) => {
    const { data } = await httpClient.post(`${eventServiceUrl}/internal/events`, eventData);
    return data;
  },
});
