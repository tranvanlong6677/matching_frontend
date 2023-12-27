import { Button, notification } from 'antd';
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';

import { hourScheduleItems } from '../../../../../utils/hourScheduleItems';
import { customerApi } from '../../../../../api/customerApi/customerApi';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { timeValue } from '../../../../../utils/timeValue';
import { dayItems } from '../../../../../utils/dayItems';
import config from '../../../../../config';
import {
  alertFail,
  alertSuccess,
  checkPathDeleteV2,
  checkPathUpdate,
  formatCash,
  getLocalStorage,
} from '../../../../../helper/common';

const ReConfirmChangeBooking = () => {
  const location: Location = useLocation();
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // GET DATA LOCAL
  const userDeleteStatus = getLocalStorage('dltstt');
  const scheduleData = getLocalStorage('cse');
  const serviceData = getLocalStorage('srv');
  const castData = getLocalStorage('cast');
  const matchingData = getLocalStorage('odt');
  let userData: any = {
    service: '',
    date: '',
    hour: '',
    money: '¥0,000',
    money_2: '¥00,000',
  };

  if (!checkPathDeleteV2(location.pathname)) {
    const date: Date = new Date(scheduleData?.date);
    const scheduleValue: string = `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${
      dayItems[date.getDay()]
    }) ${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]} `;

    // SET USER DATA FOR DELETE
    userData.date = scheduleValue;
    userData.hour = scheduleData?.hour;
    userData.service = serviceItems[serviceData - 1]?.label;
  }

  if (!checkPathUpdate(location.pathname)) {
    const date: Date = new Date(scheduleData?.date);
    const scheduleValue: string = `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${
      dayItems[date.getDay()]
    }) ${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]} `;

    // SET USER DATA FOR UPDATE
    userData.date = scheduleValue;
    userData.hour = scheduleData?.hour;
    userData.service = serviceItems[serviceData - 1]?.label;
  }

  // CHECK USER RE-REGISTER WITH HISTORY MATCHING
  if (location.pathname.search(config.routes.customerChangeHistory) !== -1) {
    const date: Date = new Date(scheduleData?.date);
    const scheduleValue: string = `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${
      dayItems[date.getDay()]
    }) ${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date - 1]} `;
    userData.service = serviceItems[serviceData - 1]?.label;
    userData.date = scheduleValue;
    userData.hour = scheduleData?.hour;
  }

  const handleChangeBooking = async (): Promise<void> => {
    // HANDLE DELETE BOOKING WHEN DELETE
    if (!checkPathDeleteV2(location.pathname)) {
      const dataDeleteBooking: any = {
        id: userDeleteStatus?.id,
        reason: {
          reason: userDeleteStatus?.reason_delete,
        },
      };
      try {
        const res: any = await customerApi.deleteBooking(dataDeleteBooking);
        if (res.status === 'success') {
          alertSuccess(api, 'Success');
          navigate(config.routes.customerDeleBookingSuccess);
          localStorage.removeItem('dltstt');
        }
      } catch (error: any) {
        if (error?.response?.data?.status === 'fail') {
          alertFail(api, 'Fail');
        }
      }
    }

    // HANDLE UPDATE BOOKING
    if (!checkPathUpdate(location.pathname)) {
      const dateConvert: Date = new Date(scheduleData?.date);
      const month: string | number =
        dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
      const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();
      const dataSubmit: any = {
        date: `${dateConvert.getFullYear()}-${month}-${day}`,
        service_id: serviceData,
        start_time: scheduleData?.start_date,
        end_time: scheduleData?.end_date,
        assign_user_id: castData?.user_id === 'none' ? null : castData?.user_id,
        old_matching_id: castData?.matching_id === undefined ? null : castData?.matching_id,
        matching_id: matchingData?.matching_id,
      };

      try {
        const res: any = await customerApi.customerBooking(dataSubmit);
        if (res?.status === 'success') {
          navigate(config.routes.customerBookingSuccess);
        }
      } catch (e) {
        alertFail(api, 'Fail');
      }
    }

    // HANDLE RE-BOOKING WITH HISTORY MATCHING
    if (location.pathname.search(config.routes.customerChangeHistory) !== -1) {
      const dateConvert: Date = new Date(scheduleData?.date);
      const month: string | number =
        dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
      const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();
      const dataSubmit: any = {
        service_id: serviceData,
        end_time: scheduleData?.end_date,
        start_time: scheduleData?.start_date,
        old_matching_id: castData?.matching_id,
        date: `${dateConvert.getFullYear()}-${month}-${day}`,
        request_description: scheduleData?.request_description,
        cast_service_id: scheduleData?.id === null ? undefined : scheduleData?.id,
      };

      try {
        const res: any = await customerApi.customerBooking(dataSubmit);
        if (res?.status === 'success') {
          navigate(config.routes.customerBookingSuccess);
        }
      } catch (e) {
        alertFail(api, 'Fail');
      }
    }
  };

  const handleBackBtn = (): void => {
    const pathArray: string[] = location.pathname.split('/');
    if (pathArray[pathArray.length - 1] === 'confirm') {
      navigate(`/user/mypage/reserve/select/${id}/update`);
    }
    if (pathArray[pathArray.length - 1] === 'cancel-confirm') {
      navigate(`/user/mypage/reserve/select/${id}/cancel`);
    }
    if (location.pathname.search(config.routes.customerChangeHistory) !== -1) {
      navigate(`/user/mypage/reserve/history/select/${id}`);
    }
  };

  return (
    <div className="confirm-booking-container container-680">
      {showPopup}
      <h1 className="title">予約内容変更確認画面</h1>
      <div className="info-content">
        <div className="info-content-element">
          <span className="field">サービス</span>
          <span className="value">{userData?.service}</span>
        </div>
        <div className="info-content-element reservation-time">
          <span className="field">予約日時</span>
          <span className="value">{userData?.date}</span>
        </div>
        <div className="info-content-element">
          <span className="field">依頼時間</span>
          <span className="value">{hourScheduleItems[parseInt(userData?.hour) - 1]?.title}</span>
        </div>
        <div className="info-content-element no-border">
          <span className="field">内訳</span>
        </div>
        <div className="info-content-element">
          <span className="field">キャンセルのためキャスト指名料は解除されました</span>
          <span className="value">¥0,000</span>
        </div>
        <div className="info-content-element">
          <span className="field">サービス料</span>
          <span className="value">¥{formatCash(`${(userData?.hour + 1) * 6000}`)}</span>
        </div>
        <div className="info-content-element">
          <span className="field">キャンセルのためクーポンは解除されました</span>
          <span className="value">¥00,000</span>
        </div>
        <div className="info-content-element">
          <span className="field">概算料金</span>
          <span className="value">¥{formatCash(`${(userData?.hour + 1) * 6000}`)}</span>
        </div>
        <div className="line-price"></div>
        <div className="info-content-element red ">
          <span className="field red">キャンセル料金</span>
          <span className="value">¥{formatCash(`${scheduleData?.cancel_cost}`)} </span>
        </div>
      </div>
      <div className="price-total-block ">
        <span className="field">最終確定料金</span>
        <span className="value">¥{formatCash(`${scheduleData?.cancel_cost}`)} (税込)</span>
      </div>
      <div className="note-block"></div>
      <div className={'attention'}>
        <div className="content-attention">
          <div className="info-attention-item  no-border">
            <span className="field">キャンセル理由</span>
            <span className="value">{userDeleteStatus?.reason_delete}</span>
          </div>
          <p>
            ※キャンセル可能期日を過ぎたキャンセルの場合には、キャンセル確定後
            キャンセル料金を、ご登録いただいたクレジットカードにご請求いたします。
          </p>
        </div>
      </div>

      <div className="button-block confirm-booking-btn">
        <Button className="btn" onClick={handleBackBtn}>
          内容変更をキャンセル
        </Button>
        <Button htmlType="submit" className="btn cr-allow" onClick={handleChangeBooking}>
          {`確定 `}
        </Button>
      </div>
    </div>
  );
};

export default ReConfirmChangeBooking;
