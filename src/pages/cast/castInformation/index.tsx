import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { getCastDetail } from '../../../redux/services/castSlice';
import { logout } from '../../../redux/services/authSlice';
import { setLocalStorage } from '../../../helper/common';
import image from '../../../assets/images/index';
import config from '../../../config';

const CastInformation = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { castDetails, date_time } = useSelector((state: any) => state.castReducer);

  // HOOK EFFECT
  useEffect((): void => {
    dispatch(getCastDetail());
  }, [dispatch]);

  // HANDLE LOGOUT
  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate(config.routes.logoutCast);
    } catch (error) {}
  };

  // HANDLE EDIT BANK
  const handleEditBank = (): void => {
    const userData: any = {
      password: '',
      day: date_time?.day,
      year: date_time?.year,
      month: date_time?.month,
      city: castDetails?.city,
      name: castDetails?.name,
      email: castDetails?.email,
      password_confirmation: '',
      gender: castDetails.gender,
      street: castDetails?.street,
      station: castDetails?.station,
      province: castDetails?.province,
      ecn: castDetails?.cast_detail?.ecn,
      postal_code: castDetails?.postal_code,
      description: castDetails?.description,
      station_time: castDetails?.station_time,
      name_furigana: castDetails?.name_furigana,
      salary: castDetails?.cast_detail?.salary,
      name_building: castDetails?.name_building,
      transportation: castDetails?.transportation,
      etc_name: castDetails?.cast_detail?.etc_name,
      year_experience: castDetails?.cast_detail?.year_experience,
      etc_relationship: castDetails?.cast_detail?.etc_relationship,
      available_service: castDetails?.cast_detail?.available_service,
    };

    // BANK DATA
    const userBankData: any = {
      bank_name: castDetails?.cast_detail?.bank_name,
      store_name: castDetails?.cast_detail?.store_name,
      account_name: castDetails?.cast_detail?.account_name,
      account_type: castDetails?.cast_detail?.account_type,
      account_number: castDetails?.cast_detail?.account_number,
    };

    // SET DATA LOCAL
    setLocalStorage('usrdt', userData);
    setLocalStorage('usrbdt', userBankData);
    setLocalStorage('usredt', true);
    setLocalStorage('usredb', true);
    // NAVIGATE
  };
  const handleSignup = () => {
    setLocalStorage('usresu', true);
  };
  return (
    <>
      <div className="block-information container-680">
        <div className="content">
          <div className="menu-content">
            <span className="head-title title-information-block">
              <div className="icon">
                <img src={image.iconUserMini} id="img-size" className="icon-ml" alt="" />
              </div>
              <h2 className="head-title-info">会員情報の確認・変更</h2>
            </span>
            <ul className="item-menu">
              <li>
                <Link to={config.routes.castDetails}> 会員情報の確認</Link>
              </li>
              <li>
                <Link to={config.routes.editCast} onClick={handleSignup}>
                  会員情報の変更
                </Link>
              </li>
              <li>
                <Link to={config.routes.signUpBankEdit} onClick={handleEditBank}>
                  振込先情報の変更
                </Link>
              </li>
              <li>
                <Link to={config.routes.sendEmailChangePassword}> パスワードの変更</Link>
              </li>
              <li>
                <Link to={config.routes.deleteCastAccount}>サービスの退会</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="block-info-btn">
          <button
            className="btn"
            onClick={(): void => {
              navigate(config.routes.castDashboard);
            }}
          >
            戻る
          </button>
          <button className="btn ct-allow" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </>
  );
};

export default CastInformation;
