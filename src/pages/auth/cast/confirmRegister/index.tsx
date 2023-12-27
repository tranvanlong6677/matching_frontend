import { Dispatch } from 'redux';
import { notification } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { alertFail, alertSuccess, formatPostalCode, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import { availableServiceItems } from '../../../../utils/availableServiceItems';
import { transportationItems } from '../../../../utils/transportationItems';
import { optionBankMoney } from '../../../../utils/accountTypeItems';
import { castExperience } from '../../../../utils/castExperience';
import { editCast } from '../../../../redux/services/castSlice';
import StatusBar from '../../../../components/status/statusBar';
import { salaryItems } from '../../../../utils/salaryItems';
import { listGender } from '../../../../utils/genderItems';
import { authApi } from '../../../../api';
import config from '../../../../config';
import { policyAccount } from '../../../../utils/policy-account';

const ConfirmRegister = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [checkedPolicy, setCheckedPolicy]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // GET DATA LOCAL
  const userData = getLocalStorage('usrdt');
  const userBankData = getLocalStorage('usrbdt');
  const userEditStatus = getLocalStorage('usredt');

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

  // HANDLE SUBMIT REGISTER
  const handleSubmitRegister = async (): Promise<void> => {
    if (checkedPolicy) {
      const dataSubmit: any = {
        ecn: userData.ecn,
        name: userData.name,
        city: userData.city,
        email: userData.email,
        token: userData.token,
        gender: userData.gender,
        street: userData.street,
        salary: userData.salary,
        station: userData.station,
        password: userData.password,
        province: userData.province,
        etc_name: userData.etc_name,
        bank_name: userBankData.bank_name,
        postal_code: userData.postal_code,
        description: userData.description,
        station_time: userData.station_time,
        store_name: userBankData.store_name,
        name_furigana: userData.name_furigana,
        name_building: userData.name_building,
        transportation: userData.transportation,
        account_type: userBankData.account_type,
        account_name: userBankData.account_name,
        year_experience: userData.year_experience,
        etc_relationship: userData.etc_relationship,
        account_number: userBankData.account_number,
        available_service: userData.available_service,
        password_confirmation: userData.password_confirmation,
        dob: `${userData.year}-${userData.month}-${userData.day}`,
        role: 3,
      };

      try {
        const res: any = await authApi.castSignUp(dataSubmit);
        if (res.status === 'success') {
          alertSuccess(api, 'Success');
          navigate(config.routes.registerSuccess);
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

  // HANDLE EDIT
  const handleSubmitEdit = async (): Promise<void> => {
    if (checkedPolicy) {
      const dataEditSubmit: any = {
        ecn: userData.ecn,
        name: userData.name,
        city: userData.city,
        email: userData.email,
        gender: userData.gender,
        street: userData.street,
        salary: userData.salary,
        station: userData.station,
        password: userData.password,
        province: userData.province,
        etc_name: userData.etc_name,
        postal_code: userData.postal_code,
        bank_name: userBankData.bank_name,
        description: userData.description,
        station_time: userData.station_time,
        store_name: userBankData.store_name,
        name_building: userData.name_building,
        name_furigana: userData.name_furigana,
        transportation: userData.transportation,
        account_name: userBankData.account_name,
        account_type: userBankData.account_type,
        year_experience: userData.year_experience,
        etc_relationship: userData.etc_relationship,
        account_number: userBankData.account_number,
        available_service: userData.available_service,
        password_confirmation: userData.password_confirmation,
        dob: `${userData.year}-${userData.month}-${userData.day}`,
      };

      try {
        const res = await dispatch(editCast(dataEditSubmit));
        if (res.payload.status === 'success') {
          alertSuccess(api, 'Success');
          localStorage.removeItem('usredt');
          localStorage.removeItem('usrbdt');
          localStorage.removeItem('usrdt');
          const user = getLocalStorage('user');
          if (user !== null) {
            const tmpUserData = {
              ...user,
              name: userData?.name,
            };
            setLocalStorage('user', tmpUserData);
          }
          navigate(config.routes.editCastSuccess);
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    }
  };

  return (
    <div className="check-container container-680">
      {showPopup}
      <div className="information-input">
        {userEditStatus ? (
          <div className="title information-input-title mb-0">
            <span>会員情報の変更</span>
          </div>
        ) : (
          <>
            <StatusBar page1={true} page2={true} />
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
          {/* <div className="infor-element">
            <span className="field">パスワード</span>
            <span className="value">{renderPassword(userData?.password?.length)}</span>
          </div> */}
          <div className="infor-element">
            <span className="field">生年月日</span>
            <span className="value">
              {userData !== null ? `${userData?.year}年${userData?.month}月${userData?.day}日` : ''}
            </span>
          </div>
          <div className="infor-element">
            <span className="field">性別</span>
            <span className="value">{listGender[userData?.gender - 1]}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">〒</span>
            <span className="value">{formatPostalCode(userData?.postal_code)}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">都道府県</span>
            <span className="value">{userData?.province}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">市区町村</span>
            <span className="value">{userData?.city}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">丁目番地</span>
            <span className="value">{userData?.street}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">建物名・号室</span>
            <span className="value">{userData?.name_building}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">最寄り駅</span>
            <span className="value">{userData?.station}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">最寄り駅からの移動手段</span>
            <span className="value">{transportationItems[userData?.transportation - 1]?.title}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">最寄り駅からの時間（分）</span>
            <span className="value">{`${userData?.station_time}分`}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">緊急連絡先 電話番号</span>
            <span className="value">{userData?.ecn}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">緊急連絡先 氏名</span>
            <span className="value">{userData?.etc_name}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">緊急連絡先 続柄</span>
            <span className="value">{userData?.etc_relationship}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">家事経験年数</span>
            <span className="value">{castExperience[userData?.year_experience - 1]?.title}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">可能提供サービス</span>
            <span className="value">{availableServiceItems[userData?.available_service - 1]?.title}</span>
          </div>
          <div className="infor-element infor-custom">
            <span className="field">ご希望の月額報酬</span>
            <span className="value">{salaryItems[userData?.salary - 1]?.title}</span>
          </div>
          <div className="infor-block-item">
            <span className="field">備考</span>
            <span className="value">{userData?.description}</span>
          </div>

          <div className="title information-input-title-body">
            <span>振込先情報確認</span>
          </div>
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
          <>
            <div className="title information-input-title-body">
              <span>利用規約</span>
            </div>

            <div className="rules">
              <div className="rules-container">
                <label htmlFor="textarea" style={{ display: 'none' }}>
                  textarea
                </label>
                <textarea id="textarea" defaultValue={policyAccount[0].policySignUp} readOnly></textarea>
              </div>
            </div>

            <div className="checkbox-rules">
              <label htmlFor="checkbox-rules">
                <input
                  id="checkbox-rules"
                  name="checkbox-rules"
                  type="checkbox"
                  onChange={(e: React.ChangeEvent<any>): void => {
                    setCheckedPolicy(e.target.checked);
                  }}
                />
                <span>上記を確認・同意しました</span>
              </label>
            </div>
          </>
        </div>
      </div>
      {userEditStatus ? (
        <div className="btn-check-container">
          <button
            onClick={(): void => {
              navigate(config.routes.editCast);
            }}
            className="btn"
          >
            戻る
          </button>
          <button onClick={handleSubmitEdit} className={`btn ${!checkedPolicy ? ' not-allowed' : ' allowed ct-allow'}`}>
            登録
          </button>
        </div>
      ) : (
        <div className="btn-check-container">
          <button
            className="btn"
            onClick={(): void => {
              navigate(config.routes.castSignUp);
            }}
          >
            内容を変更
          </button>
          <button
            className={`btn ${!checkedPolicy ? ' not-allowed' : ' allowed ct-allow'}`}
            disabled={!checkedPolicy}
            onClick={handleSubmitRegister}
          >
            登録
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmRegister;
