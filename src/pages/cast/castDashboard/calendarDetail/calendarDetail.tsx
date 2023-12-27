/* eslint-disable jsx-a11y/anchor-is-valid */
import { Spin } from 'antd';
import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Dispatch } from 'redux';

import images from '../../../../assets/images';
import ModalSuccess from '../../../../components/modalSuccess/modalSuccess';
import config from '../../../../config';
import { convertDateMatching, formatPostalCode } from '../../../../helper/common';
import { getJobMatchingById } from '../../../../redux/services/castSlice';
import { serviceItems } from '../../../../utils/customerServiceItems';
import { hourArrayItems } from '../../../../utils/hourArrayItems';

const TYPE_THIRD: string = 'third'; // BEFORE 3 DAYS
const TYPE_FOURTH: string = 'fourth'; // AFTER 3 DAYS
const TYPE_FIFTH: string = 'fifth'; // AFTER 3 DAYS

export default function CalendarDetail(): JSX.Element {
  const { matchingId }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // HOOK STATE
  const [warningType, setWarningType]: [string, React.Dispatch<any>] = useState(TYPE_THIRD);
  const [showChangeWarning, setShowChangeWarning]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // REDUCER
  const { castJobMatchingById, loading } = useSelector((state: any) => state.castReducer);

  // GET DATE NOW
  const dateNow: Date = new Date();

  // CHECK DATA
  const date: Date | null = castJobMatchingById?.date ? new Date(castJobMatchingById.date) : null;

  // check undeleted and not done
  const hasDeleteRequest: boolean =
    castJobMatchingById !== 0 && castJobMatchingById && new Date(castJobMatchingById?.date) > dateNow;

  // HOOK EFFECT
  useEffect((): void => {
    if (matchingId !== castJobMatchingById?.id) {
      dispatch(getJobMatchingById(matchingId));
    }
  }, [dispatch, matchingId, castJobMatchingById?.id]);

  // HANDLE CANCEL BOOKING
  const handleCancelBooking = (): void => {
    const tmpDate: Date = new Date();
    if (date && castJobMatchingById?.cast_old !== null && castJobMatchingById?.cast_old !== undefined) {
      if (addDays(tmpDate.setHours(23, 59, 59, 999), 6) < date!) {
        setWarningType(TYPE_THIRD);
      }
      if (addDays(tmpDate.setHours(23, 59, 59, 999), 6) > date!) {
        setWarningType(TYPE_FOURTH);
      }
      setShowChangeWarning(true);
    }
    if (date && castJobMatchingById?.cast_old === null && addDays(tmpDate.setHours(23, 59, 59, 59), 6) > date!) {
      setWarningType(TYPE_FIFTH);
      setShowChangeWarning(true);
    }
    if (date && castJobMatchingById?.cast_old === null && addDays(tmpDate.setHours(23, 59, 59, 999), 6) < date!) {
      navigate(`${config.routes.castChangeSchedule}/${matchingId}/applicate`);
    }
  };

  return (
    <div className="calendar-detail-container container-680">
      <ModalSuccess
        cast
        type={warningType}
        showChangeWarning={showChangeWarning}
        setShowChangeWarning={setShowChangeWarning}
      />
      <div className="calendar-title">
        <span className="icon">
          <img src={images.iconDocument} alt="Error" />
        </span>
        <span className="title">ご依頼内容詳細</span>
      </div>
      <Spin spinning={false}>
        {!loading && castJobMatchingById && (
          <div
            className={`${
              castJobMatchingById?.deleted_at !== null && castJobMatchingById?.deleted_at !== undefined
                ? ''
                : 'bg-detail'
            }`}
          >
            <div
              className={`${
                castJobMatchingById?.deleted_at !== null && castJobMatchingById?.deleted_at !== undefined
                  ? 'overlay'
                  : 'bg-detail'
              }`}
            ></div>
            <div className="customer">
              <span className="customer-date">{convertDateMatching(castJobMatchingById?.date)}</span>
              <span className="customer-name">{`${castJobMatchingById?.name}様`}</span>
            </div>
            <div className="calendar-info">
              <span className="calendar-info-field">サービス</span>
              <span className="calendar-info-value">{serviceItems[castJobMatchingById?.service_id - 1]?.label}</span>
            </div>
            <div className="calendar-info">
              <span className="calendar-info-field">予約日時</span>
              <span className="calendar-info-value">{`${convertDateMatching(castJobMatchingById?.date)} ${
                !!castJobMatchingById?.start_time ? hourArrayItems[castJobMatchingById?.start_time - 1]?.title : ''
              } ${!!castJobMatchingById?.start_time ? '~' : ''} ${
                !!castJobMatchingById?.end_time ? hourArrayItems[castJobMatchingById?.end_time]?.title : ''
              }`}</span>
            </div>
            <div className="calendar-info">
              <span className="calendar-info-field">最寄駅</span>
              <span className="calendar-info-value">{castJobMatchingById?.station}</span>
            </div>
            <div className="calendar-info">
              <span className="calendar-info-field">住所</span>
              <span className="calendar-info-value">
                〒{formatPostalCode(castJobMatchingById?.postal_code)}
                <br />
                {castJobMatchingById?.province} {castJobMatchingById?.street} {castJobMatchingById?.city}
              </span>
            </div>
            <div className="calendar-info">
              <span className="calendar-info-field">指名</span>
              <span className="calendar-info-value">{castJobMatchingById?.cast_old || 'なし'} </span>
            </div>
            <div className="request-content">
              <span className="request-content-title">備考</span>
              <p className="calendar-info-value">{castJobMatchingById?.request_description}</p>
            </div>
          </div>
        )}
      </Spin>

      <div className="btn-calendar-info">
        <button
          className="btn"
          onClick={(): void => {
            navigate(config.routes.castDashboard);
          }}
        >
          戻る
        </button>
        {hasDeleteRequest && castJobMatchingById?.deleted_at === null ? (
          <button className="btn ct-allow" onClick={handleCancelBooking}>
            キャスト変更依頼
          </button>
        ) : (
          ''
        )}
      </div>
      <div className="back">
        <span>キャンセル及び変更に関する注意点は</span>
        <a href="#" className="underline">
          コチラ
        </a>
      </div>
    </div>
  );
}
