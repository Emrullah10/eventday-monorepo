import { EventNotFoundError, EventFullError, DuplicateTicketError } from '../../domain/errors/index.js';

const ERROR_MAP = {
  EVENT_NOT_FOUND: EventNotFoundError,
  EVENT_FULL: EventFullError,
  DUPLICATE_TICKET: DuplicateTicketError,
};

export const makeCreateBooking = ({ bookingRepo }) => async ({ userId, eventId }) => {
  const result = await bookingRepo.createTicket({ userId, eventId });
  if (result.error) {
    const ErrorClass = ERROR_MAP[result.error];
    throw new ErrorClass();
  }
  return result.ticket;
};
