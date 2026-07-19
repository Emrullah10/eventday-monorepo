import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import EventsPage from '@pages/EventsPage';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

export const publicRoutes = [
  { path: ROUTE_PATHS.HOME, element: <EventsPage /> },
  { path: ROUTE_PATHS.LOGIN, element: <LoginPage /> },
  { path: ROUTE_PATHS.REGISTER, element: <RegisterPage /> },
];
