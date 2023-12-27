import { Spin } from 'antd';
import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { buildingHeightItems } from '../../../../utils/buildingHeightItems';
import { transportationItems } from '../../../../utils/transportationItems';
import { getCastDetail } from '../../../../redux/services/castSlice';
import imgCard from '../../../../assets/images/mockup/visa-img.png';
import { CapacityMItems } from '../../../../utils/capacityMItems';
import { CapacityKItems } from '../../../../utils/capacityKItems';
import { BuildingType } from '../../../../utils/buildingType';
import { listGender } from '../../../../utils/genderItems';
import { JobItems } from '../../../../utils/jobItems';
import config from '../../../../config';
import { Dispatch } from 'redux';

export default function DetailCustomer(): JSX.Element {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { castDetails, date_time, expired_date, loading } = useSelector((state: any) => state.castReducer);

  React.useEffect((): void => {
    dispatch(getCastDetail());
  }, [dispatch]);

  const handleEditBank = (): void => {
    navigate(config.routes.editCustomer);
  };
  const formatPostalCode = (postalCode: any) => {
    const formattedPostalCode = postalCode?.replace(/^(\d{3})(\d{4})$/, '$1-$2');
    return formattedPostalCode;
  };
  return (
    <div className="check-container check-container-user settings-details container-680">
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
              <span className="field">パスワード</span>
              <span className="value">・・・・・・・・・・・・</span>
            </div>
            <div className="infor-element">
              <span className="field">生年月日</span>
              <span className="value">
                {date_time?.year === undefined ? '' : `${date_time?.year}年${date_time?.month}月${date_time?.day}日`}
              </span>
            </div>
            <div className="infor-element">
              <span className="field">性別</span>
              <span className="value">{listGender[castDetails?.gender - 1]}</span>
            </div>
            <div className="infor-element">
              <span className="field">ご職業</span>
              <span className="value">{JobItems[castDetails?.customer_detail?.profession - 1]?.title}</span>
            </div>
            <div className="infor-element">
              <span className="field">〒</span>
              <span className="value">{formatPostalCode(castDetails?.postal_code)}</span>
            </div>
            <div className="infor-element">
              <span className="field">都道府県</span>
              <span className="value">{castDetails?.province}</span>
            </div>
            <div className="infor-element">
              <span className="field">市区町村</span>
              <span className="value">{castDetails?.city}</span>
            </div>
            <div className="infor-element">
              <span className="field">丁目番地</span>
              <span className="value">{castDetails?.street}</span>
            </div>
            <div className="infor-element">
              <span className="field">建物名・号室</span>
              <span className="value">{castDetails?.name_building}</span>
            </div>
            <div className="infor-element">
              <span className="field">最寄り駅</span>
              <span className="value">{castDetails?.station}</span>
            </div>
            <div className="infor-element time-nearest">
              <span className="field">最寄り駅からの移動手段</span>
              <span className="value">{transportationItems[castDetails?.transportation - 1]?.title}</span>
            </div>
            <div className="infor-element shipping-details">
              <span className="field">移動手段の詳細</span>
              <span className="value">{castDetails?.customer_detail?.note}</span>
            </div>
            <div className="infor-element time-nearest">
              <span className="field">最寄り駅からの時間（分）</span>
              <span className="value">{castDetails?.station_time ? `${castDetails?.station_time}分` : ``}</span>
            </div>
            <div className="infor-element building-type">
              <span className="field">建物種別</span>
              <span className="value">{BuildingType[castDetails?.customer_detail?.building_type - 1]?.title}</span>
            </div>
            <div className="infor-element">
              <span className="field">お家の広さ</span>
              <span className="value">{CapacityMItems[castDetails?.customer_detail?.capacity_m - 1]?.title}</span>
            </div>
            <div className="infor-element">
              <span className="field">間取り</span>
              <span className="value"> {CapacityKItems[castDetails?.customer_detail?.capacity_k - 1]?.title}</span>
            </div>
            <div className="infor-element">
              <span className="field">階数</span>
              <span className="value">
                {buildingHeightItems[castDetails?.customer_detail?.building_height - 1]?.title}
              </span>
            </div>
            <div className="infor-block-item">
              <div>
                <span>備考</span>
                <span>{castDetails?.description}</span>
              </div>
            </div>

            <div className="title information-input-title-body">
              <span>決済情報確認</span>
            </div>
            <div className="infor-element">
              <span className="field">ご利用カード</span>
              <span className="value">
                <img src={imgCard} alt="" />
              </span>
            </div>
            <div className="infor-element">
              <span className="field">カード番号</span>
              <span className="value">
                {castDetails?.customer_detail?.card_number &&
                  `**** **** **** ${castDetails?.customer_detail?.card_number?.slice(
                    castDetails?.customer_detail?.card_number?.length - 4,
                  )}`}
              </span>
            </div>
            <div className="infor-element">
              <span className="field">カード名義人</span>
              <span className="value">{castDetails?.customer_detail?.card_holder}</span>
            </div>
            <div className="infor-element">
              <span className="field">有効期限</span>
              <span className="value">
                {expired_date?.length === undefined ? '' : `${expired_date[0]}月 ${expired_date[1]}年`}
              </span>
            </div>
            <div className="infor-element time-nearest">
              <span className="field">セキュリティコード</span>
              <span className="value">***</span>
            </div>
          </div>
        </div>
        <div>
          <div className="btn-check-container">
            <button
              className="btn btn-check"
              onClick={(): void => {
                navigate(config.routes.customerInformation);
              }}
            >
              戻る
            </button>
            <button className="btn cr-allow" onClick={handleEditBank}>
              内容を変更
            </button>
          </div>
        </div>
      </Spin>
    </div>
  );
}
