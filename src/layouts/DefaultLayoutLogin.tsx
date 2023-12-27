import { ChildrenProps } from '../types';

const DefaultLayoutLogin = ({ children }: ChildrenProps) => {
  return (
    <div className="wrapper wrapper-login">
      <div className="login-container">{children}</div>
    </div>
  );
};

export default DefaultLayoutLogin;
