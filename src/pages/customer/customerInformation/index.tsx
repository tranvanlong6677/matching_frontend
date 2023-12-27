import { useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getCastDetail } from '../../../redux/services/castSlice';
import { logout } from '../../../redux/services/authSlice';
import { setLocalStorage } from '../../../helper/common';
import image from '../../../assets/images/index';
import config from '../../../config';
import { Dispatch } from 'redux';

export default function CustomerInformation(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const { castDetails, date_time } = useSelector((state: any) => state.castReducer);

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate(config.routes.logoutCustomer);
    } catch (error) {}
  };
  useEffect((): void => {
    localStorage.removeItem('isEditBankOnly');
    localStorage.removeItem('isOnlyRevise');
  }, []);

  useEffect((): void => {
    dispatch(getCastDetail());
  }, [dispatch]);

  const handleSignUpBank = (): void => {
    const userData: any = {
      day: date_time?.day,
      year: date_time?.year,
      name: castDetails?.name,
      city: castDetails?.city,
      month: date_time?.month,
      email: castDetails?.email,
      gender: castDetails?.gender,
      street: castDetails?.street,
      station: castDetails?.station,
      province: castDetails?.province,
      postal_code: castDetails?.postal_code,
      description: castDetails?.description,
      station_time: castDetails?.station_time,
      name_furigana: castDetails?.name_furigana,
      name_building: castDetails?.name_building,
      note: castDetails?.customer_detail?.note,
      transportation: castDetails?.transportation,
      capacity_m: castDetails?.customer_detail?.capacity_m,
      profession: castDetails?.customer_detail?.profession,
      capacity_k: castDetails?.customer_detail?.capacity_k,
      building_type: castDetails?.customer_detail?.building_type,
      building_height: castDetails?.customer_detail?.building_height,
    };
    const userBankData: any = {
      card_type: castDetails?.customer_detail?.card_type,
      card_number: castDetails?.customer_detail?.card_number,
      card_holder: castDetails?.customer_detail?.card_holder,
      expired_date: castDetails?.customer_detail?.expired_date,
      security_code: castDetails?.customer_detail?.security_code,
    };

    setLocalStorage('usrdt', userData);
    setLocalStorage('usrbdt', userBankData);
    setLocalStorage('usredt', true);
    setLocalStorage('isEditBankOnly', true);
    navigate(config.routes.customerSignupBankEdit);
  };

  return (
    <div>
      <div className="block-information block-information-customer container-680">
        <div className="content">
          <div className="menu-content">
            <span className="head-title title-information-block">
              <div className="icon">
                <img src={image.iconUserMini} id="img-size" className="icon-ml" alt="" />
              </div>
              <h2 className=" head-title-info">会員情報の確認・変更</h2>
            </span>
            <ul className="item-menu">
              <li>
                <Link to={config.routes.detailCustomer}> 会員情報の確認</Link>
              </li>
              <li>
                <Link
                  to={config.routes.editCustomer}
                  onClick={(): void => {
                    setLocalStorage('isOnlyRevise', true);
                  }}
                >
                  会員情報の変更
                </Link>
              </li>
              <li>
                <Link to={config.routes.customerSignupBankEdit} onClick={handleSignUpBank}>
                  クレジットカードの変更
                </Link>
              </li>
              <li>
                <Link to={config.routes.customerSendEmailChangePassword}>パスワードの変更</Link>
              </li>
              <li>
                <Link to={config.routes.deleteCustomerAccount}>サービスの退会</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="block-info-btn">
          <button
            onClick={(): void => {
              navigate(config.routes.customerDashboard);
            }}
            className="btn btn-check "
          >
            戻る
          </button>
          <button className="btn cr-allow" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
