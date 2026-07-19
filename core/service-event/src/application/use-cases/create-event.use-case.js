export const makeCreateEvent = ({ eventRepo }) => (eventData) => eventRepo.create(eventData);
