import { makeBookingRepository } from './infrastructure/persistence/repositories/booking.repository.js';
import { makeCreateBooking } from './application/use-cases/create-booking.use-case.js';
import { makeGetUserTickets } from './application/use-cases/get-user-tickets.use-case.js';
import { wrapWithHttpTranslation } from './interfaces/http/translate-domain-error.js';

export const buildBookingCore = ({ rawQuery, withTransaction, translateHttpErrors = true }) => {
  const bookingRepo = makeBookingRepository({ rawQuery, withTransaction });
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  return {
    createBooking: wrap(makeCreateBooking({ bookingRepo })),
    getUserTickets: wrap(makeGetUserTickets({ bookingRepo })),
  };
};

export { makeBookingRepository } from './infrastructure/persistence/repositories/booking.repository.js';
