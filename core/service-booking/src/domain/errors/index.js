import { NotFoundError, ConflictError } from '@everyday/errors';

export class EventNotFoundError extends NotFoundError {
  constructor() {
    super('Event not found');
  }
}

export class EventFullError extends ConflictError {
  constructor() {
    super('Event is full');
  }
}

export class DuplicateTicketError extends ConflictError {
  constructor() {
    super('You already have a ticket for this event');
  }
}
