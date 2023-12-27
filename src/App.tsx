import { ConfigProvider } from 'antd';
import { Fragment, Suspense, useEffect, useLayoutEffect } from 'react';
import { Location, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { checkPathDelete, checkPathUpdate, getLocalStorage } from './helper/common';
import ProtectedAdminRoutes from './routes/protectedAdminRoutes';
import CheckCustomerSignUp from './routes/checkCustomerSignUp';
import DefaultLayoutAdmin from './layouts/DefaultLayoutAdmin';
import { CAST_ROLE, USER_ROLE } from './utils/userRole';
import CheckCastSignup from './routes/checkCastSignUp';
import ProtectedRoutes from './routes/protectedRoutes';
import DefaultLayout from './layouts/DefaultLayout';
import Error from './components/Error';
import './assets/styles/style.scss';
import config from './config';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import {
  adminRoutes,
  castRoutes,
  castSignUpRoutes,
  customerRoutes,
  customerSignUpRoutes,
  publicRoutes,
  superPublicRoutes,
  changePasswordRoutes,
} from './routes/routes';
import CheckPasswordChange from './routes/checkPasswordChange';

export const antIcon = <LoadingOutlined className="icon-loading" spin />;

export default function App(): JSX.Element {
  const location: Location = useLocation();
  const user = getLocalStorage('user');
  const statusEkyc = getLocalStorage('ekstt');

  useLayoutEffect(() => {
    if (
      location.pathname !== config.routes.editCast &&
      location.pathname !== config.routes.castBankDetail &&
      location.pathname !== config.routes.confirmRegisterEdit &&
      location.pathname !== config.routes.signUpBankEdit &&
      location.pathname !== config.routes.editCustomer &&
      location.pathname !== config.routes.customerSignupBankEdit &&
      location.pathname !== config.routes.confirmRegisterCustomerEdit &&
      location.pathname !== config.routes.castSignUp &&
      location.pathname !== config.routes.signUpBank &&
      location.pathname !== config.routes.confirmRegister &&
      location.pathname !== config.routes.signupCustomer &&
      location.pathname !== config.routes.customerSignupBank &&
      location.pathname !== config.routes.confirmRegisterCustomer &&
      location.pathname !== config.routes.customerCheckCompleteEmail &&
      location.pathname !== config.routes.checkCompleteEmail &&
      location.pathname !== config.routes.notedRegister &&
      location.pathname !== config.routes.confirmChangeInfoCreditCardEdit
    ) {
      localStorage.removeItem('usredt');
      localStorage.removeItem('usrdt');
      localStorage.removeItem('usrbdt');
      localStorage.removeItem('usr');
      localStorage.removeItem('usredb');
    }
    if (
      location.pathname !== config.routes.customerScheduleService &&
      location.pathname !== config.routes.customerScheduleDetail &&
      location.pathname !== config.routes.confirmBookingCustomer &&
      location.pathname !== config.routes.customerBookingDetail &&
      location.pathname !== config.routes.customerConfirmInformation &&
      checkPathUpdate(location.pathname) &&
      checkPathDelete(location.pathname) &&
      location.pathname.search(config.routes.customerChangeHistory) &&
      location.pathname !== config.routes.customerConfirmInformationHistory &&
      location.pathname !== config.routes.customerBookingDetailHistory &&
      location.pathname !== config.routes.customerconfirmHistory &&
      location.pathname !== config.routes.reConfirmChangeBookingHistory
    ) {
      localStorage.removeItem('cast');
      localStorage.removeItem('srv');
      localStorage.removeItem('cse');
      localStorage.removeItem('dltstt');
      localStorage.removeItem('odt');
      localStorage.removeItem('idh');
      localStorage.removeItem('udd');
    }

    window.scrollTo(0, 0);
  }, [location]);

  const castRoute = castRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayout;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === null) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const customerRoute = customerRoutes.map((route: any) => {
    let Page = route.component;
    let Layout: any = DefaultLayout;
    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === null) {
      Layout = Fragment;
    }
    if (statusEkyc && route.path !== config.routes.customerDashboard) {
      if (statusEkyc?.status_ekyc !== 2 || statusEkyc?.status_hearing !== 2 || statusEkyc === null) {
        return '';
      }
    }
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const publicRoute = publicRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayout;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const superPublicRoute = superPublicRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayout;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const castSignUpRoute = castSignUpRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayout;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const customerSignUpRoute = customerSignUpRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayout;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const adminRoute = adminRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayoutAdmin;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  const changePasswordRoute = changePasswordRoutes.map((route: any) => {
    const Page = route.component;
    let Layout: any = DefaultLayoutAdmin;

    if (route.layout) {
      Layout = route.layout;
    } else if (route.layout === undefined) {
      Layout = Fragment;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  return (
    <div className="App">
      <Suspense
        fallback={
          <div className="loading-spinner">
            <Spin indicator={antIcon} />
          </div>
        }
      >
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Hiragino Sans,sans-serif',
            },
          }}
        >
          <Helmet>
            <meta name="robots" content="noindex"></meta>
            <meta name="googlebot" content="noindex"></meta>
          </Helmet>
          <Routes>
            {user?.role === USER_ROLE && <Route element={<ProtectedRoutes />}>{customerRoute}</Route>}
            {user?.role === CAST_ROLE && <Route element={<ProtectedRoutes />}>{castRoute}</Route>}
            {user?.role !== USER_ROLE && user?.role !== CAST_ROLE && (
              <Route element={<ProtectedRoutes />}>
                {customerRoute}
                {castRoute}
              </Route>
            )}
            <Route element={<CheckPasswordChange />}>{changePasswordRoute}</Route>
            <Route element={<CheckCastSignup />}>{castSignUpRoute}</Route>
            <Route element={<CheckCustomerSignUp />}>{customerSignUpRoute}</Route>
            <Route element={<ProtectedAdminRoutes />}>{adminRoute}</Route>
            {/* {customerRoute}
            {castRoute}
            {publicRoute} */}
            {user?.role === undefined ? publicRoute : ''}
            {superPublicRoute}
            <Route path="*" element={<Error />} />
          </Routes>
        </ConfigProvider>
      </Suspense>
    </div>
  );
}
