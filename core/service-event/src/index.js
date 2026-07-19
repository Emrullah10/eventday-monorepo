import { makeEventRepository } from './infrastructure/persistence/repositories/event.repository.js';
import { makeCreateEvent } from './application/use-cases/create-event.use-case.js';
import { makeListEvents } from './application/use-cases/list-events.use-case.js';
import { makeGetEventById } from './application/use-cases/get-event-by-id.use-case.js';
import { makeGetPendingEvents } from './application/use-cases/get-pending-events.use-case.js';
import { makeUpdateEventStatus } from './application/use-cases/update-event-status.use-case.js';
import { makeEditAndApproveEvent } from './application/use-cases/edit-and-approve-event.use-case.js';
import { wrapWithHttpTranslation } from './interfaces/http/translate-domain-error.js';

export const buildEventCore = ({ rawQuery, translateHttpErrors = true }) => {
  const eventRepo = makeEventRepository({ rawQuery });
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  return {
    createEvent: wrap(makeCreateEvent({ eventRepo })),
    listEvents: wrap(makeListEvents({ eventRepo })),
    getEventById: wrap(makeGetEventById({ eventRepo })),
    getPendingEvents: wrap(makeGetPendingEvents({ eventRepo })),
    updateEventStatus: wrap(makeUpdateEventStatus({ eventRepo })),
    editAndApproveEvent: wrap(makeEditAndApproveEvent({ eventRepo })),
    eventRepo,
  };
};

export { makeEventRepository } from './infrastructure/persistence/repositories/event.repository.js';
