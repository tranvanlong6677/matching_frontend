import Header from '../components/header';
import { ChildrenProps } from '../types';

const DefaultLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="wrapper">
      <Header />
      <div className="drawer-wrapper"></div>
      <>{children}</>
    </div>
  );
};

export default DefaultLayout;
