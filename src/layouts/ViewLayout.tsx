import Header from '../components/header';
import { ChildrenProps } from '../types';

const ViewLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="wrapper">
      <Header />
      <div className="container">{children}</div>
    </div>
  );
};

export default ViewLayout;
