import { NavigateFunction, useNavigate } from 'react-router-dom';
import image from '../../../../assets/images/index';
import config from '../../../../config';

export default function Logout({ isCast, isCustomer }: any) {
  const navigate: NavigateFunction = useNavigate();

  // HANDLE NAVIGATE
  const handleLogout = (): void => {
    if (isCast) {
      navigate(config.routes.login);
    }
    if (isCustomer) {
      navigate(config.routes.loginCustomer);
    }
  };

  return (
    <div className="block-logout container-630">
      <h2>Log Out</h2>
      <p>ログアウトしました。</p>
      <div className="confirm-btn-container">
        {isCast ? (
          <button className="btn btn-confirm btn-black" onClick={handleLogout}>
            <img src={image.iconUser} alt="Error" /> <span> ログインページへ</span>
          </button>
        ) : (
          <button className="btn cr-allow" onClick={handleLogout}>
            <span> ログインページへ</span>
          </button>
        )}
      </div>
    </div>
  );
}
