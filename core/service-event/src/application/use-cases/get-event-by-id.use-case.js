import { EventNotFoundError } from '../../domain/errors/index.js';

export const makeGetEventById = ({ eventRepo }) => async (id) => {
  const event = await eventRepo.findById(id);
  if (!event) throw new EventNotFoundError();
  return event;
};
