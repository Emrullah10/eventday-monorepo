import { requireAdmin } from './require-admin.js';
import { EventNotFoundError } from '../../domain/errors/index.js';

export const makeUpdateEventStatus = ({ eventRepo }) => async ({ actorRole, eventId, status }) => {
  requireAdmin(actorRole);
  const event = await eventRepo.updateStatus(eventId, status);
  if (!event) throw new EventNotFoundError();
  return event;
};
