import { requireAdmin } from './require-admin.js';

export const makeGetPendingEvents = ({ eventRepo }) => async (actorRole) => {
  requireAdmin(actorRole);
  return eventRepo.findAll({ status: 'DRAFT' });
};
