import { NotFoundError, ForbiddenError } from '@everyday/errors';

export class EventNotFoundError extends NotFoundError {
  constructor() {
    super('Event not found');
  }
}

export class AdminRoleRequiredError extends ForbiddenError {
  constructor() {
    super('Admin role required');
  }
}
