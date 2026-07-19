import axios from 'axios';
import { makeAiAnalyst } from './infrastructure/ai/ai-analyst.js';
import { makeEventServiceGateway } from './infrastructure/gateways/event-service.gateway.js';
import { fetchPatikaEvents } from './infrastructure/sources/patika.source.js';
import { fetchMeetupEvents } from './infrastructure/sources/meetup.source.js';
import { fetchCoderspaceEvents } from './infrastructure/sources/coderspace.source.js';
import { makeProcessSourceEvents } from './application/use-cases/process-source-events.use-case.js';
import { makeSyncAll } from './application/use-cases/sync-all.use-case.js';

export const buildAggregatorCore = ({ eventServiceUrl, geminiApiKey, logger, httpClient = axios }) => {
  const eventGateway = makeEventServiceGateway({ httpClient, eventServiceUrl });
  const aiAnalyst = makeAiAnalyst({ apiKey: geminiApiKey, logger });
  const processSourceEvents = makeProcessSourceEvents({ eventGateway, aiAnalyst, logger });
  const sources = { fetchPatikaEvents, fetchMeetupEvents, fetchCoderspaceEvents };

  return {
    syncAll: makeSyncAll({ sources, processSourceEvents, logger }),
  };
};
