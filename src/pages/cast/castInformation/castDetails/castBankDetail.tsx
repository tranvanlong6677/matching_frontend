import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { alertFail, alertSuccess, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import { editCast, getCastDetail } from '../../../../redux/services/castSlice';
import { optionBankMoney } from '../../../../utils/accountTypeItems';
import config from '../../../../config';

export default function CastBankDetail(): JSX.Element {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const userBankData = getLocalStorage('usrbdt');
  const [api, showPopup]: any = notification.useNotification();
  const { castDetails } = useSelector((state: any) => state.castReducer);

  // HOOK EFFECT
  useEffect((): void => {
    if (userBankData) {
      setLocalStorage('usrbdt', userBankData);
    }
  }, [userBankData]);
  useEffect((): void => {
    dispatch(getCastDetail());
  }, [dispatch]);

  const handleSubmitEditBank = async (): Promise<void> => {
    const dataEditSubmit: any = {
      password: '',
      password_confirmation: '',
      dob: castDetails?.date_of_birth,
      city: castDetails?.city,
      name: castDetails?.name,
      email: castDetails?.email,
      gender: castDetails?.gender,
      street: castDetails?.street,
      station: castDetails?.station,
      province: castDetails?.province,
      ecn: castDetails?.cast_detail?.ecn,
      postal_code: castDetails?.postal_code,
      description: castDetails?.description,
      station_time: castDetails?.station_time,
      name_building: castDetails?.name_building,
      salary: castDetails?.cast_detail?.salary,
      name_furigana: castDetails?.name_furigana,
      transportation: castDetails?.transportation,
      etc_name: castDetails?.cast_detail?.etc_name,
      etc_relationship: castDetails?.cast_detail?.etc_relationship,
      year_experience: castDetails?.cast_detail?.year_experience,
      available_service: castDetails?.cast_detail?.available_service,
      bank_name: userBankData?.bank_name,
      account_name: userBankData?.account_name,
      account_number: userBankData?.account_number,
      account_type: userBankData?.account_type,
      store_name: userBankData?.store_name,
    };
    try {
      const res = await dispatch(editCast(dataEditSubmit));
      if (res.payload.status === 'success') {
        alertSuccess(api, 'Success');
        localStorage.removeItem('usredt');
        localStorage.removeItem('usrbdt');
        localStorage.removeItem('usrdt');
        localStorage.removeItem('usredb');
        navigate(config.routes.editCastSuccess);
      }
    } catch (error) {
      alertFail(api, 'Fail');
    }
  };

  return (
    <div className="check-container settings-details container-680">
      {showPopup}
      <div className="information-input">
        <div className="title information-input-title">
          <h2 className="title-confirm-bank">振込先情報の変更</h2>
        </div>
        <div className="infor-element-container">
          <div className="infor-element">
            <span className="field">金融機関名</span>
            <span className="value">{userBankData?.bank_name}</span>
          </div>
          <div className="infor-element">
            <span className="field">支店名</span>
            <span className="value">{userBankData?.store_name}</span>
          </div>
          <div className="infor-element">
            <span className="field">預金種別</span>
            <span className="value">{optionBankMoney[userBankData?.account_type - 1]?.label}</span>
          </div>
          <div className="infor-element">
            <span className="field">口座番号</span>
            <span className="value">{userBankData?.account_number}</span>
          </div>
          <div className="infor-element">
            <span className="field">口座名義</span>
            <span className="value">{userBankData?.account_name}</span>
          </div>
          <div className="btn-check-container">
            <div className="block-bank-btn">
              <button className="btn" onClick={() => navigate(config.routes.signUpBankEdit)}>
                戻る
              </button>
              <button className="btn btn-customer" onClick={handleSubmitEditBank}>
                登録
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
