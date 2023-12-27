import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import confirmImage from '../../assets/images/mockup/success-image.png';
import StatusBarCustomer from '../status/statusbarCustomer';
import image, { images } from '../../assets/images/index';
import StatusBar from '../status/statusBar';
import config from '../../config';

interface SuccessActionType {
  header?: any;
  title?: string;
  textDescription?: any;
  customer?: boolean;
  editCustomer?: boolean;
  castEdit?: boolean;
  castRegister?: boolean;
  deleteCast?: boolean;
  bookingSuccess?: boolean;
  surveySuccess?: boolean;
  noImage?: boolean;
  mail?: boolean;
  deleteAccount?: boolean;
  isReBooking?: boolean;
  deleteBookingCustomer?: boolean;
}
export default function SuccessAction({
  header,
  title,
  textDescription,
  customer = false,
  deleteAccount = false,
  editCustomer = false,
  castEdit = false,
  mail = false,
  castRegister = false,
  deleteCast = false,
  bookingSuccess = false,
  surveySuccess = false,
  noImage = false,
  isReBooking = false,
  deleteBookingCustomer = false,
}: SuccessActionType) {
  const navigate: NavigateFunction = useNavigate();
  let path: string = '';
  const { pathname } = useLocation();
  const classContainerDeleteBooking = deleteBookingCustomer ? 'delete-booking-customer' : '';

  if (customer) {
    path = config.routes.loginCustomer;
  }
  if (castEdit) {
    path = config.routes.castDashboard;
  }
  if (castRegister) {
    path = config.routes.login;
  }
  if (editCustomer) {
    path = config.routes.customerDashboard;
  }
  if (deleteCast) {
    path = config.routes.home;
  }
  if (bookingSuccess) {
    path = config.routes.customerDashboard;
  }
  if (isReBooking) {
    path = config.routes.customerDashboard;
  }
  return (
    <div
      className={
        customer && deleteAccount && deleteCast
          ? `confirm-container container-630 delete-account-container ${classContainerDeleteBooking}`
          : `confirm-container container-630 ${classContainerDeleteBooking}`
      }
    >
      {header ? (
        <>
          {!customer ? (
            <div className="mb-img-success">
              <StatusBar page1={true} page2={true} page3={true} />
            </div>
          ) : (
            <div className={pathname === '/user/signup/complete' ? '' : 'mb-img-success'}>
              <StatusBarCustomer page1={true} page2={true} page3={true} />
            </div>
          )}
        </>
      ) : (
        ''
      )}
      <div className="confirm">
        {noImage ? (
          ''
        ) : (
          <img src={mail ? images.iconDove : !surveySuccess ? confirmImage : images?.iconSurveyDone} alt="" />
        )}
        <div className={`confirm-content-container ${deleteAccount ? 'block-delete' : ''}`}>
          <h1 className="head-title">{title}</h1>
          <span>{textDescription}</span>
        </div>
      </div>

      <div className={`${noImage ? 'warning-block' : ''} confirm-btn-container`}>
        {bookingSuccess ? (
          <button
            className={'btn cr-allow btn-change-service'}
            onClick={(): void => {
              navigate(config.routes.customerScheduleService);
            }}
          >
            他のサービスを予約
          </button>
        ) : (
          ''
        )}
        <button
          className="btn btn-confirm"
          onClick={(): void => {
            navigate(path);
          }}
        >
          {<img src={image.iconUser} alt="" />}
          <span> {deleteCast && deleteAccount && customer ? 'サービスサイトへ' : 'マイページTOPへ'}</span>
        </button>
      </div>
    </div>
  );
}
