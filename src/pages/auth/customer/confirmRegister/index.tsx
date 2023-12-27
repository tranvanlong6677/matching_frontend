import { Dispatch } from 'redux';
import { notification } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { alertFail, alertSuccess, formatPostalCode, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import StatusBarCustomer from '../../../../components/status/statusbarCustomer';
import { transportationItems } from '../../../../utils/transportationItems';
import { buildingHeightItems } from '../../../../utils/buildingHeightItems';
import { updateCustomer } from '../../../../redux/services/customerSlice';
import { customerApi } from '../../../../api/customerApi/customerApi';
import { CapacityKItems } from '../../../../utils/capacityKItems';
import { CapacityMItems } from '../../../../utils/capacityMItems';
import { listGender } from '../../../../utils/genderItems';
import { JobItems } from '../../../../utils/jobItems';
import config from '../../../../config';
import { USER_ROLE } from '../../../../utils/userRole';
import imgCard from '../../../../assets/images/mockup/visa-img.png';
import { policyAccount } from '../../../../utils/policy-account';

const ConfirmRegisterCustomer = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [checkedPolicy, setCheckedPolicy]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // GET DATA LOCAL
  const userData = getLocalStorage('usrdt');
  const userBankData = getLocalStorage('usrbdt');
  const userEditStatus = getLocalStorage('usredt');

  let date: any = {
    month: '',
    year: '',
  };

  if (userBankData !== null) {
    const tmpDateArray = userBankData?.expired_date?.split('-');
    date.month = tmpDateArray[0];
    date.year = tmpDateArray[1];
  }

  if (!userEditStatus) {
    if (userData === null && userBankData !== null) {
      navigate(config.routes.castSignUp);
    }
    if (userData !== null && userBankData === null) {
      navigate(config.routes.signUpBank);
    }
    if (userData === null && userBankData === null) {
      navigate(config.routes.sendMailToRegister);
    }
  }

  // HANDLE REGISTER
  const handleSubmitRegister = async (): Promise<void> => {
    if (checkedPolicy) {
      const dataSubmit: any = {
        name: userData?.name,
        city: userData?.city,
        note: userData?.note,
        email: userData?.email,
        token: userData?.token,
        gender: userData?.gender,
        street: userData?.street,
        station: userData?.station,
        password: userData?.password,
        province: userData?.province,
        capacity_k: userData?.capacity_k,
        profession: userData?.profession,
        capacity_m: userData?.capacity_m,
        postal_code: userData?.postal_code,
        card_type: userBankData?.card_type,
        description: userData?.description,
        station_time: userData?.station_time,
        card_holder: userBankData?.card_holder,
        name_furigana: userData?.name_furigana,
        card_number: userBankData?.card_number,
        name_building: userData?.name_building,
        building_type: userData?.building_type,
        transportation: userData?.transportation,
        expired_date: userBankData?.expired_date,
        security_code: userBankData?.security_code,
        building_height: userData?.building_height,
        password_confirmation: userData?.password_confirmation,
        dob: `${userData?.year}-${userData?.month}-${userData?.day}`,
        role: USER_ROLE,
      };

      try {
        const res: any = await customerApi.signUp(dataSubmit);
        if (res.status === 'success') {
          alertSuccess(api, 'Success');
          navigate(config.routes.registerCustomerSuccess);
          localStorage.removeItem('usrdt');
          localStorage.removeItem('usrbdt');
          localStorage.removeItem('usr');
        }
      } catch (error: any) {
        if (error?.response?.data?.status === 'fail') {
          alertFail(api, 'Fail');
        }
      }
    } else {
      alertFail(api, '利用規約に同意する必要があります');
    }
  };

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
        localStorage.removeItem('isOnlyRevise');

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
    <div className="check-container confirm-register-customer container-680">
      {showPopup}
      <div className="information-input">
        {userEditStatus ? (
          <div className="title information-input-title">
            <span>入力情報確認</span>
          </div>
        ) : (
          <>
            <StatusBarCustomer page1={true} page2={true} />
            <div className="title information-input-title information-input-title-check">
              <span>入力情報確認</span>
            </div>
          </>
        )}
        <div className="infor-element-container">
          <div className="infor-element">
            <span className="field">氏名</span>
            <span className="value">{userData?.name}</span>
          </div>
          <div className="infor-element">
            <span className="field">ふりがな</span>
            <span className="value">{userData?.name_furigana}</span>
          </div>
          <div className="infor-element infor-element-email">
            <span className="field">メールアドレス</span>
            <span className="value">{userData?.email}</span>
          </div>
          <div className="infor-element">
            <span className="field">パスワード</span>
            <span className="value">・・・・・・・・・・・・</span>
          </div>
          <div className="infor-element">
            <span className="field">生年月日</span>
            <span className="value">
              {!!userData?.year ? `${userData?.year}年${userData?.month}月${userData?.day}日` : ''}
            </span>
          </div>
          <div className="infor-element">
            <span className="field">性別</span>
            <span className="value">{listGender[userData?.gender - 1]}</span>
          </div>
          <div className="infor-element">
            <span className="field">ご職業</span>
            <span className="value">{JobItems[userData?.profession - 1]?.title}</span>
          </div>
          <div className="infor-element">
            <span className="field">〒</span>
            <span className="value">{formatPostalCode(userData?.postal_code)}</span>
          </div>
          <div className="infor-element">
            <span className="field">都道府県</span>
            <span className="value">{userData?.province}</span>
          </div>
          <div className="infor-element">
            <span className="field">市区町村</span>
            <span className="value">{userData?.city}</span>
          </div>
          <div className="infor-element">
            <span className="field">丁目番地</span>
            <span className="value">{userData?.street}</span>
          </div>
          <div className="infor-element">
            <span className="field">建物名・号室</span>
            <span className="value">{userData?.name_building}</span>
          </div>
          <div className="infor-element">
            <span className="field">最寄り駅</span>
            <span className="value">{userData?.station}</span>
          </div>
          <div className="infor-element time-nearest">
            <span className="field">最寄り駅からの移動手段</span>
            <span className="value">
              {!!userData?.transportation && transportationItems[userData?.transportation - 1]?.title}
            </span>
          </div>

          {/* NEW */}
          <div className="infor-element shipping-details">
            <span className="field">移動手段の詳細</span>
            <span className="value">{userData?.note}</span>
          </div>
          <div className="infor-element time-nearest">
            <span className="field">最寄り駅からの時間（分）</span>
            <span className="value">{userData?.station_time ? `${userData?.station_time}分` : ''}</span>
          </div>
          <div className="infor-element">
            <span className="field">お家の広さ</span>
            <span className="value">{!!userData?.capacity_m && CapacityMItems[userData?.capacity_m - 1]?.title}</span>
          </div>
          <div className="infor-element">
            <span className="field">間取り</span>
            <span className="value">{!!userData?.capacity_k && CapacityKItems[userData?.capacity_k - 1]?.title}</span>
          </div>
          <div className="infor-element">
            <span className="field">何階建て</span>
            <span className="value">
              {!!userData?.building_height && buildingHeightItems[userData?.building_height - 1]?.title}
            </span>
          </div>
          <div className="infor-element infor-element-comment">
            <span className="field">備考</span>
            <span className="value">{userData?.description}</span>
          </div>

          <div className="title information-input-title-body">
            <span>決済情報確認</span>
          </div>
          <div className="infor-element">
            <span className="field">ご利用カード</span>
            <span className="value">
              {' '}
              <img src={imgCard} alt="" />
            </span>
          </div>
          <div className="infor-element">
            <span className="field">カード番号</span>
            <span className="value">
              {userBankData?.card_number &&
                `**** **** **** ${userBankData?.card_number?.slice(userBankData?.card_number?.length - 4)}`}
            </span>
          </div>
          <div className="infor-element">
            <span className="field">カード名義人</span>
            <span className="value">{userBankData?.card_holder}</span>
          </div>
          <div className="infor-element">
            <span className="field">有効期限</span>
            <span className="value">{`${date?.month}月 ${date.year}年`}</span>
          </div>
          <div className="infor-element time-nearest">
            <span className="field">セキュリティコード</span>
            <span className="value">***</span>
          </div>
          {userEditStatus || userBankData || true ? (
            <>
              <div className="title information-input-title-body">
                <span>利用規約</span>
              </div>

              <div className="rules">
                <div className="rules-container">
                  <textarea defaultValue={policyAccount[0]?.policySignUp} readOnly></textarea>
                </div>
              </div>

              <div className="checkbox-rules">
                <label htmlFor="checkbox-rules">
                  <input
                    type="checkbox"
                    id="checkbox-rules"
                    name="checkbox-rules"
                    onChange={(e: React.ChangeEvent<any>): void => {
                      setCheckedPolicy(e.target.checked);
                    }}
                  />
                  <span>上記を確認・同意しました</span>
                </label>
              </div>
            </>
          ) : (
            ''
          )}
          {userEditStatus ? (
            <div className="btn-check-container">
              <button
                onClick={(): void => {
                  if (userEditStatus) {
                    navigate(config.routes.customerSignupBankEdit);
                  } else {
                    navigate(config.routes.editCustomer);
                  }
                }}
                className="btn btn-check"
              >
                戻る
              </button>
              <button
                onClick={handleSubmitEdit}
                className={checkedPolicy ? `btn btn-customer` : `btn not-allowed`}
                disabled={!checkedPolicy}
              >
                登録
              </button>
            </div>
          ) : (
            <div className="btn-check-container">
              <button
                className="btn btn-check"
                onClick={(): void => {
                  navigate(config.routes.signupCustomer);
                }}
              >
                内容を変更
              </button>
              <button
                className={`btn ${checkedPolicy ? ' cr-allow btn-customer' : ' not-allowed'}`}
                disabled={!checkedPolicy}
                onClick={handleSubmitRegister}
              >
                登録
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegisterCustomer;
