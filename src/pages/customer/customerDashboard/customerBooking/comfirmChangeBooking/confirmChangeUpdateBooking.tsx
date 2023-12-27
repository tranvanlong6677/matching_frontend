import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';

import { hourScheduleItems } from '../../../../../utils/hourScheduleItems';
import { formatCash, getLocalStorage } from '../../../../../helper/common';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { timeValue } from '../../../../../utils/timeValue';
import { dayItems } from '../../../../../utils/dayItems';
import config from '../../../../../config';

const CHOOSE_FEE: number = 1000;
const MOVING_EXPENSES: number = 1000;
const DEFAULT_FEE: number = 6000;

const CustomerConfirmUpdateBooking = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { id }: any = useParams();
  let scheduleTime: string = '';

  const serviceData = getLocalStorage('srv');
  const castData = getLocalStorage('cast');
  const scheduleData = getLocalStorage('cse');
  const bookingId = getLocalStorage('idh');

  if (scheduleData !== null) {
    const dateConvert: Date = new Date(scheduleData?.date);
    scheduleTime = `${dateConvert.getFullYear()}年${dateConvert.getMonth() + 1}月${dateConvert.getDate()}日（${
      dayItems[dateConvert.getDay()]
    }）${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]}`;
  }

  // CALCULATE PRICE

  // phi chi dinh
  const calculateSpecifiedPrice = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null && castData?.user_id !== 'none') {
      return CHOOSE_FEE * (+scheduleData?.hour + 1);
    }
    return 0;
  };

  // phi di lai
  const calculateMovingExpenses = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null) {
      return MOVING_EXPENSES;
    }
    return 0;
  };

  // phi dich vu
  const calculateDefaultFee = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null) {
      return DEFAULT_FEE * (+scheduleData?.hour + 1);
    }
    return 0;
  };

  const calculateTotalFee = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null) {
      return calculateDefaultFee() + MOVING_EXPENSES + calculateSpecifiedPrice();
    }
    return 0;
  };

  const calculateReducePrice = (): any => {
    if (
      scheduleData?.hour !== undefined &&
      scheduleData?.hour! &&
      scheduleData?.coupon_code !== null &&
      scheduleData?.off_percent !== null
    ) {
      return calculateTotalFee() * (+scheduleData?.off_percent / 100);
    }
    return 0;
  };

  return (
    <>
      <div className="block-confirm-info reserve-update-container container-680">
        <div className="content">
          <div className="menu-content">
            <div className="head-title" id="no-border">
              <h2 className="item-title-hearing">予約内容変更確認画面</h2>
            </div>
            <div className="item-content">
              <div className="item-confirm-inline">
                <p>サービス</p>
                <p>{serviceData !== null && serviceItems[serviceData - 1]?.label}</p>
              </div>

              <div className="item-confirm-inline">
                <p>予約日時</p>
                <p>{scheduleTime}</p>
              </div>
              <div className="item-confirm-inline">
                <p>依頼時間</p>
                <p>{hourScheduleItems[scheduleData?.hour - 1]?.title}</p>
              </div>
              <div className="item-confirm-inline">
                <p>キャスト指名料</p>
                <p>¥{formatCash(calculateSpecifiedPrice().toString())}</p>
              </div>
              <div className="item-confirm-inline">
                <p>サービス料金</p>
                <p>¥{formatCash(calculateMovingExpenses().toString())}</p>
              </div>
              <div className="item-confirm-inline">
                <p>クーポン利用</p>
                <p>{calculateReducePrice() === 0 ? '¥0' : `−¥${formatCash(calculateReducePrice().toString())}`}</p>
              </div>
              <div className="item-confirm-inline">
                <p>概算料金</p>
                <p>
                  ¥
                  {calculateReducePrice() === 0
                    ? formatCash(calculateTotalFee().toString())
                    : formatCash((calculateTotalFee() - calculateReducePrice()).toString())}
                  （税込）
                </p>
              </div>
              <div className="item-detail"></div>
            </div>
          </div>
          <div className="block-btn-confirm-info">
            <button
              className="btn btn-check"
              onClick={(): void => {
                if (location.pathname === config.routes.customerConfirmHistory) {
                  navigate(`${config.routes.customerChangeHistory}/${bookingId}`);
                } else {
                  navigate(`${config.routes.customerChangeBooking}/${id}`);
                }
              }}
            >
              内容変更をキャンセル
            </button>
            <button
              className="btn btn-client cr-allow"
              onClick={(): void => {
                if (location.pathname === config.routes.customerConfirmHistory) {
                  navigate(config.routes.reConfirmChangeBookingHistory);
                } else {
                  navigate(`/user/mypage/reserve/select/${id}/confirm`);
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
};

export default CustomerConfirmUpdateBooking;
