import { ADMIN_ROLE } from '../utils/userRole';
import { getLocalStorage } from '../helper/common';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoutes = () => {
  const access_token: string | null = localStorage.getItem('access_token');
  const user = getLocalStorage('user');

  return <>{user?.role === ADMIN_ROLE && access_token ? <Outlet /> : <Navigate to={'/admin-dashboard/login'} />}</>;
};

export default ProtectedAdminRoutes;
