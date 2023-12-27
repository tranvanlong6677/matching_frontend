import { Button } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getLocalStorage } from '../../helper/common';
import config from '../../config';

const Home = () => {
  const navigate: NavigateFunction = useNavigate();
  const user = getLocalStorage('user');
  return (
    <div>
      <Button
        type="primary"
        onClick={(): void => {
          if (user?.role === 3) {
            navigate(config.routes.castDashboard);
          } else {
            navigate(config.routes.login);
          }
        }}
      >
        Cast
      </Button>
      <Button
        type="primary"
        onClick={(): void => {
          if (user?.role === 2) {
            navigate(config.routes.customerDashboard);
          } else {
            navigate(config.routes.loginCustomer);
          }
        }}
      >
        Customer
      </Button>
    </div>
  );
};

export default Home;
