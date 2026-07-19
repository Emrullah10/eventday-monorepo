import { AdminRoleRequiredError } from '../../domain/errors/index.js';

/**
 * Guards admin-only use-cases. The old monolith left this check as a comment
 * ("In real app, only role === 'ADMIN'") — enforcing it here closes that gap
 * for every admin use-case in one place.
 */
export const requireAdmin = (actorRole) => {
  if (actorRole !== 'ADMIN') throw new AdminRoleRequiredError();
};
