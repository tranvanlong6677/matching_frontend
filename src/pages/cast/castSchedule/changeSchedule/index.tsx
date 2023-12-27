/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { notification, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import { getJobMatchingById } from '../../../../redux/services/castSlice';
import { serviceItems } from '../../../../utils/customerServiceItems';
import { hourArrayItems } from '../../../../utils/hourArrayItems';
import { alertFail, convertDateMatching, formatCash, formatPostalCode } from '../../../../helper/common';
import { castApi } from '../../../../api';
import config from '../../../../config';

export default function CastChangeSchedule(): JSX.Element {
  const { matchingId }: any = useParams();
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // REDUCER
  const { castJobMatchingById, loading, price } = useSelector((state: any) => state.castReducer);

  // HOOK EFFECT
  useEffect((): void => {
    if (matchingId !== castJobMatchingById?.id) {
      dispatch(getJobMatchingById(matchingId));
    }
  }, [dispatch, matchingId, castJobMatchingById?.id]);

  // HANDLE CHANGE SCHEDULE
  const handleChangeSchedule = async (): Promise<void> => {
    try {
      const res: any = await castApi.deleteMatching(matchingId);
      if (res?.status === 'success') {
        navigate(`${config.routes.castChangeScheduleSuccess}/${matchingId}/complete`);
      }
    } catch (e) {
      alertFail(api, 'Fail');
    }
  };

  return (
    <div className="calendar-detail-container container-680">
      {showPopup}
      <div className="calendar-title no-border">
        <h2 className="change-schedule-title">キャスト変更依頼確認画面</h2>
      </div>
      <Spin spinning={loading}>
        <div className="block-change-schedule-info">
          <div className="calendar-info">
            <span className="calendar-info-field">ご予約者様氏名</span>
            <span className="calendar-info-value">{`${castJobMatchingById?.name}様`}</span>
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
              {`〒${formatPostalCode(castJobMatchingById?.postal_code)}`}
              <br />
              {castJobMatchingById?.province} {castJobMatchingById?.street} {castJobMatchingById?.city}
            </span>
          </div>
          <div className="calendar-info">
            <span className="calendar-info-field">指名</span>
            <span className="calendar-info-value">{castJobMatchingById?.cast_old || 'なし'} </span>
          </div>
          {price !== 0 && price !== null && price ? (
            <div className="fee-change">
              <div className="calendar-info">
                <span className="calendar-info-field">キャスト変更料金</span>{' '}
                <span className="calendar-info-value">{`${price ? `¥${formatCash(price?.toString())}` : ''}`}</span>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
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
        <button className="btn ct-allow" onClick={handleChangeSchedule}>
          確定
        </button>
      </div>
      <div className="back">
        <span>キャンセル及び変更に関する注意点は</span>
        <a href="#">コチラ</a>
      </div>
    </div>
  );
}
