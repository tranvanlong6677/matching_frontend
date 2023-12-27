import { Navigate, Outlet } from 'react-router-dom';
import config from '../config';

const CheckCastSignup = (): any => {
  const userToken: string | null = localStorage.getItem('usr');
  return userToken === null ? <Navigate to={config.routes.sendMailToRegister} /> : <Outlet />;
};

export default CheckCastSignup;
