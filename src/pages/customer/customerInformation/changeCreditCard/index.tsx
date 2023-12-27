import React from 'react';
import image from '../../../../assets/images/index';
import { Button, notification } from 'antd';
import { alertFail, alertSuccess, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import config from '../../../../config';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCustomer } from '../../../../redux/services/customerSlice';
import { Dispatch } from 'redux';

const ChangeCreditCard = () => {
  const userData = getLocalStorage('usrdt');
  const userBankData = getLocalStorage('usrbdt');
  const dateExpiredFormat = getLocalStorage('expired_date_format');
  const dateExpired: Date = new Date(`${dateExpiredFormat}-01`);
  const dateExpiredString: string = `${dateExpired?.getMonth() + 1}月 ${dateExpired?.getFullYear()}年`;
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = notification.useNotification();

  // HANDLE SUBMIT
  const handleSubmitEdit = async (): Promise<void> => {
    const dataEditSubmit: any = {
      name: userData?.name,
      city: userData?.city,
      note: userData?.note,
      email: userData?.email,
      gender: userData?.gender,
      street: userData?.street,
      station: userData?.station,
      password: userData?.password,
      province: userData?.province,
      capacity_m: userData?.capacity_m,
      capacity_k: userData?.capacity_k,
      profession: userData?.profession,
      description: userData?.description,
      postal_code: userData?.postal_code,
      card_type: userBankData?.card_type,
      station_time: userData?.station_time,
      name_building: userData?.name_building,
      card_number: userBankData?.card_number,
      card_holder: userBankData?.card_holder,
      name_furigana: userData?.name_furigana,
      building_type: userData?.building_type,
      transportation: userData?.transportation,
      expired_date: userBankData?.expired_date,
      security_code: userBankData?.security_code,
      building_height: userData?.building_height,
      password_confirmation: userData?.password_confirmation,
      dob: `${userData?.year}-${userData?.month}-${userData?.day}`,
    };

    try {
      const res = await dispatch(updateCustomer(dataEditSubmit));
      if (res.payload.status === 'success') {
        alertSuccess(api, 'Success');
        localStorage.removeItem('usredt');
        localStorage.removeItem('usrbdt');
        localStorage.removeItem('usrdt');
        localStorage.removeItem('expired_date_format');

        const user = getLocalStorage('user');
        if (user !== null) {
          const tmpUserData = {
            ...user,
            name: userData?.name,
          };
          setLocalStorage('user', tmpUserData);
        }
        navigate(config.routes.customerEditSuccess);
      }
    } catch (error) {
      alertFail(api, 'Fail');
    }
  };
  return (
    <div className="change-credit-card-container container-680">
      {showPopup}
      <div className="title">
        <h2 className="head-title">クレジットカードの変更</h2>
      </div>

      <div className="content">
        <div className="content-element">
          <span className="field">ご利用カード</span>
          <span className="value">
            <img src={image.iconVisa} alt="" />
          </span>
        </div>
        <div className="content-element">
          <span className="field">カード番号</span>
          <span className="value">
            {userBankData?.card_number &&
              `**** **** **** ${userBankData?.card_number?.slice(userBankData?.card_number?.length - 4)}`}
          </span>
        </div>
        <div className="content-element">
          <span className="field">カード名義人</span>
          <span className="value">{userData?.name}</span>
        </div>
        <div className="content-element">
          <span className="field">有効期限</span>
          <span className="value">
            {/* 1月　2026年 */}
            {dateExpiredString}
          </span>
        </div>
        <div className="content-element">
          <span className="field">セキュリティコード</span>
          <span className="value">
            {/* {userBankData?.security_code} */}
            ****
          </span>
        </div>
      </div>

      <div className="button-block">
        <Button
          className="btn"
          onClick={() => {
            setLocalStorage('isEditBankOnly', true);
            localStorage.removeItem('expired_date_format');
            navigate(config.routes.customerSignupBankEdit);
          }}
        >
          戻る
        </Button>
        <Button
          className="btn cr-allow"
          onClick={() => {
            handleSubmitEdit();
          }}
        >
          {`登録 `}
        </Button>
      </div>
    </div>
  );
};

export default ChangeCreditCard;
