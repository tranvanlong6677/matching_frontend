/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Button, Input, notification } from 'antd';
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';

import { hourScheduleItems } from '../../../../../utils/hourScheduleItems';
import { alertFail, formatCash, getLocalStorage, setLocalStorage } from '../../../../../helper/common';
import { customerApi } from '../../../../../api/customerApi/customerApi';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { timeValue } from '../../../../../utils/timeValue';
import image from '../../../../../assets/images/index';
import config from '../../../../../config';

const CHOOSE_FEE: number = 1000;
const MOVING_EXPENSES: number = 1000;
const DEFAULT_FEE: number = 6000;
const daysOfWeek: string[] = ['日', '月', '火', '水', '木', '金', '土'];

const compareData = (a: any, b: any) => {
  let result = true;

  if (
    a?.id?.toString() === b?.id?.toString() &&
    a?.date?.toString() === b?.date?.toString() &&
    a?.end_time?.toString() === b?.end_time?.toString() &&
    a?.coupon_code?.toString() === b?.coupon_code?.toString() &&
    a?.repeat_setting?.toString() === b?.repeat_setting?.toString() &&
    a?.request_description?.toString() === b?.request_description?.toString() &&
    a?.require_user_id?.toString() === b?.assign_user_id?.toString() &&
    a?.service_id?.toString() === b?.service_id?.toString() &&
    a?.start_time?.toString() === b?.start_time?.toString()
  ) {
    result = false;
  }
  return result;
};

const CustomerBookingDetail = ({ isEdit = false }: { isEdit: boolean }) => {
  const { id }: any = useParams();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [coupon, setCoupon]: [string, React.Dispatch<any>] = useState('');
  const [offPercent, setOffPercent]: [any, React.Dispatch<any>] = useState(0);
  const [isShowNotificationCoupon, setIsShowNotificationCoupon]: [boolean, React.Dispatch<any>] =
    useState<boolean>(false);

  // GET DATA LOAL
  const castData = getLocalStorage('cast');
  const serviceData = getLocalStorage('srv');
  const scheduleData = getLocalStorage('cse');
  const oldData = getLocalStorage('old_data');

  let scheduleTime: string = '';

  if (castData !== null) {
    const dateConvert: Date = new Date(scheduleData?.date);
    const month: string | number =
      dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
    const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();
    const dayOfWeek = daysOfWeek[+dateConvert.getDay()];
    scheduleTime = `${dateConvert.getFullYear()}年${month}月${day}日 (${dayOfWeek}) ${
      timeValue[scheduleData?.start_date - 1]
    }~${timeValue[scheduleData?.end_date]}`;
  }

  const handleSubmitBooking = async (): Promise<void> => {
    const dateConvert: Date = new Date(scheduleData?.date);
    const month: string | number =
      dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
    const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();

    if (isEdit === true) {
      if (location.pathname === config.routes.reConfirmChangeBookingHistory) {
        try {
          const dataBookingRequire: any = {
            service_id: serviceData,
            date: `${dateConvert.getFullYear()}-${month}-${day}`,
            start_time: scheduleData?.start_date,
            end_time: scheduleData?.end_date,
            require_user_id: castData?.user_id,
            request_description: scheduleData?.request_description,
            coupon_code: coupon !== '' && isShowNotificationCoupon ? coupon : undefined,
          };

          const res: any = await customerApi.bookingRequire(dataBookingRequire);
          if (res?.status === 'success') {
            navigate(config.routes.customerRebookSuccess);
          } else {
            alertFail(api, 'Fail');
          }
        } catch (e) {
          alertFail(api, 'Fail');
        }
      } else {
        // HANDLE UPDATE BOOKING
        const dateConvert: Date = new Date(scheduleData?.date);
        const month: string | number =
          dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
        const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();
        const dataSubmit: any = {
          id: id,
          date: `${dateConvert.getFullYear()}-${month}-${day}`,
          service_id: serviceData,
          start_time: scheduleData?.start_date,
          end_time: scheduleData?.end_date,
          coupon_code: coupon !== '' && isShowNotificationCoupon ? coupon : null,
          request_description: scheduleData?.request_description ?? null,
          repeat_setting: scheduleData?.repeat_setting ?? null,
          require_user_id: castData?.user_id !== 'none' ? castData?.user_id : undefined,
        };

        if (compareData(dataSubmit, oldData)) {
          try {
            const res: any = await customerApi.customerBooking(dataSubmit);
            if (res?.status === 'success') {
              navigate(config.routes.customerRebookSuccess);
            }
          } catch (e) {
            alertFail(api, 'Fail');
          }
        }

        if (!compareData(dataSubmit, oldData)) {
          navigate(config.routes.customerRebookSuccess);
        }
      }
    } else {
      if (castData?.user_id === 'none') {
        const dataSubmit: any = {
          service_id: serviceData,
          date: `${dateConvert.getFullYear()}-${month}-${day}`,
          start_time: scheduleData.start_date,
          end_time: scheduleData.end_date,
          repeat_setting: null,
          request_description: scheduleData?.request_description,
          coupon_code: coupon !== '' && isShowNotificationCoupon ? coupon : undefined,
        };
        try {
          const res: any = await customerApi.matchingNotAssigned(dataSubmit);
          if (res.status === 'success') {
            navigate(config.routes.customerBookingSuccess);
          } else {
            alertFail(api, 'Fail');
          }
        } catch (e) {
          alertFail(api, 'Fail');
        }
      } else {
        if (scheduleData?.id === null) {
          try {
            const dataBookingRequire: any = {
              service_id: serviceData,
              date: `${dateConvert.getFullYear()}-${month}-${day}`,
              start_time: scheduleData?.start_date,
              end_time: scheduleData?.end_date,
              require_user_id: castData?.user_id,
              request_description: scheduleData?.request_description,
              coupon_code: coupon !== '' && isShowNotificationCoupon ? coupon : undefined,
            };

            const res: any = await customerApi.bookingRequire(dataBookingRequire);
            if (res?.status === 'success') {
              navigate(config.routes.customerBookingSuccess);
            } else {
              alertFail(api, 'Fail');
            }
          } catch (e) {
            alertFail(api, 'Fail');
          }
        } else {
          try {
            const dataSubmit: any = {
              service_id: serviceData,
              end_time: scheduleData?.end_date,
              require_user_id: castData?.user_id,
              start_time: scheduleData?.start_date,
              date: `${dateConvert.getFullYear()}-${month}-${day}`,
              request_description: scheduleData?.request_description,
              coupon_code: coupon !== '' ? coupon : undefined,
            };

            const res: any = await customerApi.customerBooking(dataSubmit);
            if (res?.status === 'success') {
              navigate(config.routes.customerBookingSuccess);
            } else {
              alertFail(api, 'Fail');
            }
          } catch (e) {
            alertFail(api, 'Fail');
          }
        }
      }
    }
  };

  // HANDLE CHECK COUPON
  const handleCheckCoupon = async (): Promise<void> => {
    try {
      if (coupon !== '') {
        const res: any = await customerApi.checkCoupon({
          coupon_code: coupon,
        });
        if (res.status === 'success' && res.data?.message === 'Coupon is valid') {
          setOffPercent(res.data?.off_percent);
          setIsShowNotificationCoupon(true);
        }
        if (res.status === 'success' && res.data?.message === 'Coupon is invalid') {
          alertFail(api, 'クーポンは無効です。');
          setIsShowNotificationCoupon(false);
        }
      } else {
        alertFail(api, 'クーポンは無効です。');
        setIsShowNotificationCoupon(false);
      }
    } catch (err) {
      alertFail(api, 'クーポンは無効です。');
      setIsShowNotificationCoupon(false);
    }
  };

  const handleRemoveCoupon = (): void => {
    setCoupon('');
    setOffPercent(0);
    setIsShowNotificationCoupon(false);
    setLocalStorage('cse', { ...scheduleData, coupon_code: '', off_percent: 0 });
  };

  // CALCULATE PRICE
  const calculateSpecifiedPrice = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null && castData?.user_id !== 'none') {
      return CHOOSE_FEE * (+scheduleData?.hour + 1);
    }
    return 0;
  };
  const calculateDefaultFee = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null) {
      return DEFAULT_FEE * (+scheduleData?.hour + 1);
    }
    return 0;
  };

  const calculateTotalFee = (): number => {
    if (scheduleData?.hour !== undefined && scheduleData?.hour !== null) {
      return DEFAULT_FEE * (+scheduleData?.hour + 1) + calculateSpecifiedPrice();
    }
    return 0;
  };
  useEffect(() => {
    if (scheduleData?.off_percent && scheduleData?.coupon_code) {
      setIsShowNotificationCoupon(true);
      setOffPercent(scheduleData?.off_percent);
      setCoupon(scheduleData?.coupon_code);
    }
  }, [scheduleData]);

  return (
    <div className="customer-booking-detail container-680">
      {showPopup}
      <div className="title title-booking-price">
        <h1>概算料金</h1>
      </div>
      <div className="booking-details-list">
        <div className="booking-details-item">
          <div className="booking-details-line">
            <span className="field">サービス</span>
            <span className="value">{serviceData !== null && serviceItems[serviceData - 1]?.label}</span>
          </div>
          <div className="booking-details-line booking-date-time-line">
            <span className="field">予約日時</span>
            <span className="value">{scheduleTime}</span>
          </div>
          <div className="booking-details-line">
            <span className="field">依頼時間</span>
            <span className="value">{hourScheduleItems[scheduleData?.hour - 1]?.title}</span>
          </div>
          <div className="booking-details-line">
            <span className="field">キャスト指名料</span>
            <span className="value">¥{formatCash(calculateSpecifiedPrice().toString())}</span>
          </div>

          <div className="booking-details-line">
            <span className="field">サービス料</span>
            <span className="value">¥{formatCash(calculateDefaultFee().toString())}</span>
          </div>
          <div className="booking-details-line">
            <span className="field total">概算料金</span>
            <p className="value">
              <span className="unit">¥</span>
              <span>{formatCash(calculateTotalFee().toString())}</span>
              <span className="note">(税込)</span>
            </p>
          </div>
        </div>
      </div>
      <div className={'coupon-group'}>
        <div className="attention">
          <p>ご登録いただいたクレジットカードの決済は、サービス提供後に行います。（サービス提供日もしくはその翌日）</p>
        </div>
        <div className="discount">
          <div>
            <Input
              placeholder={'クーポンコードを入力'}
              className="input-global discount-input-tag"
              value={coupon}
              onChange={(e: React.ChangeEvent<any>): void => {
                setCoupon(e.target.value);
              }}
              readOnly={
                scheduleData?.coupon_code !== '' &&
                scheduleData?.coupon_code !== null &&
                scheduleData?.coupon_code !== undefined
              }
            />
            <div className="coupon-actions">
              <Button
                className={`btn cr-allow coupon-btn${!coupon ? ' not-allowed' : ''}`}
                disabled={!coupon}
                onClick={handleCheckCoupon}
              >
                適用する
              </Button>

              {/*button destroy coupon*/}
              <Button
                className={`btn cr-allow coupon-btn${!coupon ? ' not-allowed' : ''}`}
                disabled={!coupon}
                onClick={handleRemoveCoupon}
              >
                適用しない
              </Button>
            </div>
          </div>
          {isShowNotificationCoupon && (
            <div className="discount-info-container">
              <div className="discount-info">
                <img src={image.infoIcon} alt="" />
                <p className="info">
                  クーポンが適用されました。
                  <br />
                  {`サービスが¥${formatCash(((calculateTotalFee() * offPercent) / 100).toString())} 割引になります。`}
                </p>
              </div>
            </div>
          )}
        </div>
        {isShowNotificationCoupon && (
          <div className="payment-container">
            <div className="payment">
              <span className="field">クーポン適用金額</span>
              <div className="value">
                <span>¥{formatCash(((calculateTotalFee() * (100 - offPercent)) / 100).toString())}</span>
                <span className="note">(税込)</span>
              </div>
            </div>
          </div>
        )}

        <div className={isShowNotificationCoupon ? 'instruct' : 'instruct instruct-show'}>
          <span>
            キャンセル及び変更に関する注意点は<a href="#">コチラ</a>
          </span>
        </div>
      </div>
      <div className="button-block">
        <Button
          className="btn"
          onClick={(): void => {
            if (location.pathname === config.routes.reConfirmChangeBookingHistory) {
              navigate(config.routes.customerConfirmHistory);
            } else {
              isEdit
                ? navigate(`/user/mypage/reserve/select/${id}`)
                : navigate(config.routes.customerConfirmInformation);
            }
          }}
        >
          内容を変更
        </Button>

        <Button className="btn cr-allow" onClick={handleSubmitBooking}>
          {`確定 `}
        </Button>
      </div>
    </div>
  );
};

export default CustomerBookingDetail;
