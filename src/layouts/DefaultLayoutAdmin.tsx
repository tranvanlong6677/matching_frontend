import React from 'react';

import Navigation from '../components/navigationAdmin';
import Header from '../components/headerAdmin';
import { ChildrenProps } from '../types';

const DefaultLayoutAdmin = ({ children }: ChildrenProps) => {
  return (
    <div className="admin-wrapper">
      <Header />
      <div className="admin-content">
        <div className="container">
          <div className="content">
            <Navigation />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayoutAdmin;
