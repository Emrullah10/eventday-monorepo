export const makeSyncAll = ({ sources, processSourceEvents, logger }) => async () => {
  logger?.info('Starting full sync from external sources...');

  const patikaEvents = await sources.fetchPatikaEvents();
  const meetupEvents = await sources.fetchMeetupEvents();

  const results = {
    patika: await processSourceEvents(patikaEvents, 'Patika.dev'),
    meetup: await processSourceEvents(meetupEvents, 'Meetup'),
    coderspace: await syncCoderspace({ sources, processSourceEvents, logger }),
  };

  return results;
};

const syncCoderspace = async ({ sources, processSourceEvents, logger }) => {
  try {
    const events = await sources.fetchCoderspaceEvents();
    logger?.info(`Found ${events.length} candidates from Coderspace.`);
    return processSourceEvents(events, 'Coderspace');
  } catch (error) {
    logger?.error('Coderspace scrape error', error.message);
    return { added: 0, skipped: 0, error: error.message };
  }
};
