import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { logout } from '../../redux/services/authSlice';
import image from '../../assets/images/index';
import config from '../../config';

const logoutStyle: any = {
  cursor: 'pointer',
};

const Index = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // HANDLE LOGOUT
  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      navigate(config.routes.adminLogin);
    } catch (error) {}
  };

  return (
    <div className="admin-header-wrapper">
      <div className="logo-wrapper">
        <div className="container">
          <div className="logo">
            <img src={image.logoAdmin} alt={'error'} />
          </div>
        </div>
      </div>
      <div className="info">
        <div className="container">
          <span className="name">Épais 管理画面</span>
          <span className="logout">
            管理者：XX XX |{' '}
            <span style={logoutStyle} onClick={handleLogout}>
              ログアウト
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
