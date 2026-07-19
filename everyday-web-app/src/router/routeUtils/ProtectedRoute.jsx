import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

/** Only checks isLoggedIn — see MONOREPO-ARCHITECTURE-TEMPLATE.md §10.6 for why role/permission checks are separate components. */
const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to={ROUTE_PATHS.LOGIN} replace />;
};

export default ProtectedRoute;
