import EventsPage from '@pages/EventsPage';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

export const protectedRoutes = [
  { path: ROUTE_PATHS.EVENTS, element: <EventsPage /> },
];
