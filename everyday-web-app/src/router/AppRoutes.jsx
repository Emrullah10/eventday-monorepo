import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routeUtils/ProtectedRoute';
import { publicRoutes } from './routes/publicRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { errorRoutes } from './routes/errorRoutes';

const AppRoutes = () => (
  <Routes>
    {publicRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
    <Route element={<ProtectedRoute />}>
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Route>
    {errorRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Routes>
);

export default AppRoutes;
