import { buildAggregatorCore } from '@everyday/core-service-aggregator';
import { makeLogger } from '@everyday/helper';
import { appConfig } from '../configs/app-config.js';

export const buildContainer = () => {
  const logger = makeLogger('everyday-service-aggregator');
  const core = buildAggregatorCore({
    eventServiceUrl: appConfig.EVENT_SERVICE_URL,
    geminiApiKey: appConfig.GEMINI_API_KEY,
    logger,
  });

  return { ...core, logger };
};
