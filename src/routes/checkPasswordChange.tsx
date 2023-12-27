import { Navigate, Outlet, useLocation } from 'react-router-dom';
import config from '../config';

const CheckPasswordChange = (): any => {
  const user: string | null = localStorage.getItem('access_token');
  const location = useLocation();
  const isUser = location.pathname === config.routes.newPasswordCustomer;

  return user === null ? (
    <Navigate to={isUser ? config.routes.loginCustomer : config.routes.login} state={location} />
  ) : (
    <Outlet />
  );
};

export default CheckPasswordChange;
