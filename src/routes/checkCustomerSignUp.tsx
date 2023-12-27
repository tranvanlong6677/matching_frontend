import { Navigate, Outlet } from 'react-router-dom';
import config from '../config';

const CheckCustomerSignup = (): any => {
  const userToken: string | null = localStorage.getItem('usr');
  return userToken === null ? <Navigate to={config.routes.sendMailtoCustomer} /> : <Outlet />;
};

export default CheckCustomerSignup;
