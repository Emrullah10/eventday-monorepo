import { requireAdmin } from './require-admin.js';
import { EventNotFoundError } from '../../domain/errors/index.js';

export const makeEditAndApproveEvent = ({ eventRepo }) => async ({ actorRole, eventId, data }) => {
  requireAdmin(actorRole);
  const event = await eventRepo.editAndPublish(eventId, data);
  if (!event) throw new EventNotFoundError();
  return event;
};
