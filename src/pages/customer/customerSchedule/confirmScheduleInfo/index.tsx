import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import { availableServiceItems } from '../../../../utils/availableServiceItems';
import { bookingNotAssigned } from '../../../../redux/services/customerSlice';
import { repeatSettingItems } from '../../../../utils/repeatSettingItems';
import { hourScheduleItems } from '../../../../utils/hourScheduleItems';
import { getLocalStorage } from '../../../../helper/common';
import { timeValue } from '../../../../utils/timeValue';
import { dayItems } from '../../../../utils/dayItems';
import config from '../../../../config';

export default function CustomerConfirmInformation(): JSX.Element {
  const location: Location = useLocation();
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // REDUCER
  const { resultBookingNotAssigned } = useSelector((state: any) => state.customerReducer);

  // SET STRING DEFAULT
  let scheduleTime: string = '';
  let dateBooking: string = '';

  // GET DATA LOCAL
  const serviceData = getLocalStorage('srv');
  const castData = getLocalStorage('cast');
  const scheduleData = getLocalStorage('cse');
  const bookingId = getLocalStorage('idh');

  if (scheduleData !== null) {
    const dateConvert: Date = new Date(scheduleData?.date);
    scheduleTime = `${dateConvert.getFullYear()}年${dateConvert.getMonth() + 1}月${dateConvert.getDate()}日（${
      dayItems[dateConvert.getDay()]
    }）${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]}`;
    const convertMonth =
      dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
    dateBooking = `${dateConvert.getFullYear()}-${convertMonth}-${dateConvert.getDate()}`;
  }
  // MATCHING NO CHOOSE CAST
  useEffect((): void => {
    if (castData?.user_id === 'none' && scheduleData !== null) {
      const dataSubmit: any = {
        service_id: serviceData,
        date: dateBooking,
        start_time: scheduleData.start_date,
        end_time: scheduleData.end_date,
        repeat_setting: null,
      };
      dispatch(bookingNotAssigned(dataSubmit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="block-confirm-info container-630 booking-confirm-container">
        <div className="content">
          <div className="menu-content">
            <div className="head-title" id="no-border">
              <h2 className="item-title-hearing">入力情報確認</h2>
            </div>
            <div className="item-content">
              <div className="item-confirm-inline">
                <p>サービス</p>
                <p>{serviceData !== null && `${availableServiceItems[serviceData - 1]?.title}サービス`}</p>
              </div>
              {castData !== null ? (
                <div className="item-confirm-inline">
                  <p>アサインされたキャスト</p>
                  <p>
                    {castData !== null && castData.user_id !== 'none'
                      ? castData?.name
                      : resultBookingNotAssigned
                      ? resultBookingNotAssigned?.data?.name
                      : ''}
                  </p>
                </div>
              ) : (
                ''
              )}
              <div className="item-confirm-inline">
                <p>予約日時</p>
                <p>{scheduleTime}</p>
              </div>
              <div className="item-confirm-inline">
                <p>ご依頼時間</p>
                <p>{hourScheduleItems[scheduleData?.hour - 1]?.title}</p>
              </div>
              <div className="item-confirm-inline">
                <p>希望頻度</p>
                <p>{repeatSettingItems[scheduleData?.repeat_setting - 1]?.label}</p>
              </div>
              <div className="item-detail">
                <p className="detail-text">備考</p>
                <span className="text-detail-item">
                  {scheduleData?.request_description}
                  <div className="text-detail-item"></div>
                </span>
              </div>
            </div>
          </div>
          <div className="block-btn-confirm-info">
            <button
              className="btn btn-check"
              onClick={(): void => {
                if (location.pathname === config.routes.customerConfirmInformationHistory) {
                  navigate(`${config.routes.customerChangeHistory}/${bookingId}`);
                } else {
                  navigate(config.routes.customerScheduleDetail);
                }
              }}
            >
              内容を変更
            </button>
            <button
              className="btn btn-client cr-allow"
              onClick={(): void => {
                if (location.pathname === config.routes.customerConfirmInformationHistory) {
                  navigate(config.routes.customerBookingDetailHistory);
                } else {
                  navigate(config.routes.customerBookingDetail);
                }
              }}
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
