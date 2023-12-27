import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'antd/es/notification/useNotification';
import { Location, NavigateFunction, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { alertFail, alertSuccess, setLocalStorage } from '../../../../helper/common';
import { postEmail } from '../../../../redux/services/authSlice';
import image from '../../../../assets/images/index';
import config from '../../../../config';
import { Dispatch } from 'redux';

const CheckCompleteEmail = () => {
  const location: Location = useLocation();
  let [searchParams]: any = useSearchParams();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = useNotification();

  // GET TOKEN AND EMAIL
  const token: string | null = searchParams.get('key');
  const { email } = useSelector((state: any) => state.authReducer);

  const userData: any = {
    key: 'usr',
    value: {
      token,
      email: email,
    },
    time: 300000000000000000,
  };

  if (token !== null) {
    setLocalStorage('usr', userData);
  }

  useEffect((): void => {
    if (token === null) {
      if (location.pathname === config.routes.customerCheckCompleteEmail) {
        navigate(config.routes.sendMailtoCustomer);
      }
      if (location.pathname === config.routes.checkCompleteEmail) {
        navigate(config.routes.sendMailToRegister);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const handlePostEmail = async (): Promise<void> => {
    if (location.pathname === config.routes.customerCheckCompleteEmail) {
      try {
        const res = await dispatch(
          postEmail({
            token: token,
          }),
        );
        if (res?.payload?.status === 'success') {
          alertSuccess(api, 'Success');
          navigate(config.routes.notedRegister);
        } else {
          alertFail(api, 'Fail');
        }
      } catch {}
    }
    if (location.pathname === config.routes.checkCompleteEmail) {
      try {
        const res = await dispatch(
          postEmail({
            token: token,
          }),
        );
        if (res?.payload?.status === 'success') {
          alertSuccess(api, 'Success');
          navigate(config.routes.castSignUp);
        } else {
          alertFail(api, 'Fail');
        }
      } catch {}
    }
  };
  return (
    <>
      <div className="complete-check-container container-630">
        {showPopup}
        <img src={image.iconDove} alt="" />
        <h1>メールアドレス認証が完了しました。</h1>
        <span>会員登録に進みます。</span>

        <div className="block-btn">
          <button
            className="btn cr-allow"
            onClick={(): void => {
              handlePostEmail();
            }}
          >
            会員登録へ進む
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckCompleteEmail;
