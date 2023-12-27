import { Navigate, Outlet } from 'react-router-dom';
import config from '../config';

const ProtectedRoutes = (): any => {
  // REDUCERS

  const user: string | null = localStorage.getItem('access_token');
  return user === null ? <Navigate to={config.routes.home} /> : <Outlet />;
};

export default ProtectedRoutes;
