import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { ROUTE_PATHS } from '@shared/constant/route-paths';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to={ROUTE_PATHS.HOME} replace />;
};

export default RoleProtectedRoute;
