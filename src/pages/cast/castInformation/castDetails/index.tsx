import { Spin } from 'antd';
import { Dispatch } from 'redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { availableServiceItems } from '../../../../utils/availableServiceItems';
import { transportationItems } from '../../../../utils/transportationItems';
import { getCastDetail } from '../../../../redux/services/castSlice';
import { optionBankMoney } from '../../../../utils/accountTypeItems';
import { castExperience } from '../../../../utils/castExperience';
import { salaryItems } from '../../../../utils/salaryItems';
import { formatPostalCode, setLocalStorage } from '../../../../helper/common';
import { listGender } from '../../../../utils/genderItems';
import config from '../../../../config';

const CastDetails = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // HOOK STATE

  // REDUCER
  const { castDetails, date_time, loading } = useSelector((state: any) => state.castReducer);

  // HOOK EFFECT
  useEffect((): void => {
    dispatch(getCastDetail());
  }, [dispatch]);

  const checkDate = (date: any): string => {
    if (date?.year === undefined || date?.month === undefined || date?.day === undefined) {
      return '';
    } else {
      return `${date?.year}年${date?.month}月${date?.day}日`;
    }
  };

  return (
    <div className="check-container settings-details settings-details-cast container-680">
      <Spin spinning={loading}>
        <div className="information-input">
          <div className="title information-input-title">
            <h2>会員情報の確認</h2>
          </div>
          <div className="infor-element-container">
            <div className="infor-element">
              <span className="field">氏名</span>
              <span className="value">{castDetails?.name}</span>
            </div>
            <div className="infor-element">
              <span className="field">ふりがな</span>
              <span className="value">{castDetails?.name_furigana}</span>
            </div>
            <div className="infor-element infor-element-email">
              <span className="field">メールアドレス</span>
              <span className="value">{castDetails?.email}</span>
            </div>
            <div className="infor-element">
              <span className="field">生年月日</span>
              <span className="value">{checkDate(date_time)}</span>
            </div>
            <div className="infor-element">
              <span className="field">性別</span>
              <span className="value">{listGender[castDetails?.gender - 1]}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">〒</span>
              <span className="value">{formatPostalCode(castDetails?.postal_code)}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">都道府県</span>
              <span className="value">{castDetails?.province}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">市区町村</span>
              <span className="value">{castDetails?.city}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">丁目番地</span>
              <span className="value">{castDetails?.street}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">建物名・号室</span>
              <span className="value">{castDetails?.name_building}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">最寄り駅</span>
              <span className="value">{castDetails?.station}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">最寄り駅からの移動手段</span>
              <span className="value">{transportationItems[castDetails?.transportation - 1]?.title}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">最寄り駅からの時間（分）</span>
              <span className="value">{`${castDetails?.station_time}分`}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">緊急連絡先 電話番号</span>
              <span className="value">{castDetails?.cast_detail?.ecn}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">緊急連絡先 氏名</span>
              <span className="value">{castDetails?.cast_detail?.etc_name}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">緊急連絡先 続柄</span>
              <span className="value">{castDetails?.cast_detail?.etc_relationship}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">家事経験年数</span>
              <span className="value">{castExperience[castDetails?.cast_detail?.year_experience - 1]?.title}</span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">可能提供サービス</span>
              <span className="value">
                {availableServiceItems[castDetails?.cast_detail?.available_service - 1]?.title}
              </span>
            </div>
            <div className="infor-element infor-custom">
              <span className="field">ご希望の月額報酬</span>
              <span className="value">{salaryItems[castDetails?.cast_detail?.salary - 1]?.title}</span>
            </div>
            <div className="infor-block-item">
              <span className="field">備考</span>
              <span className="value">{castDetails?.description}</span>
            </div>
            <div className="title information-input-title-body">
              <span>振込先情報確認</span>
            </div>
            <div className="infor-element institution-name">
              <span className="field">金融機関名</span>
              <span className="value">{castDetails?.cast_detail?.bank_name}</span>
            </div>
            <div className="infor-element">
              <span className="field">支店名</span>
              <span className="value">{castDetails?.cast_detail?.store_name}</span>
            </div>
            <div className="infor-element">
              <span className="field">預金種別</span>
              <span className="value">{optionBankMoney[castDetails?.cast_detail?.account_type - 1]?.label}</span>
            </div>
            <div className="infor-element">
              <span className="field">口座番号</span>
              <span className="value">{castDetails?.cast_detail?.account_number}</span>
            </div>
            <div className="infor-element">
              <span className="field">口座名義</span>
              <span className="value">{castDetails?.cast_detail?.account_name}</span>
            </div>
          </div>
        </div>
        <div className="btn-check-container">
          <button
            className={`btn`}
            onClick={(): void => {
              navigate(config.routes.castInformation);
            }}
          >
            戻る
          </button>
          <button
            onClick={(): void => {
              navigate(config.routes.editCast);
              setLocalStorage('usresu', false);
            }}
            className={`btn ct-allow`}
          >
            内容を変更
          </button>
        </div>
      </Spin>
    </div>
  );
};

export default CastDetails;
