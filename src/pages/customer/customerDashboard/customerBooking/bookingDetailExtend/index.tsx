/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React, { Dispatch, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import { alertFail, alertSuccess, getLocalStorage } from '../../../../../helper/common';
import { getBookings } from '../../../../../redux/services/customerSlice';
import { customerApi } from '../../../../../api/customerApi/customerApi';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { timeValue } from '../../../../../utils/timeValue';
import image from '../../../../../assets/images/index';
import config from '../../../../../config';

const CustomerBookingDetail = ({ isEdit = false }: { isEdit: boolean }) => {
  const { id }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [isShowNotificationCoupon, setIsShowNotificationCoupon]: any = useState<boolean>(false);
  const [bookingItemState, setBookingItemState]: any = useState<any>();
  const [api, showPopup]: any = notification.useNotification();
  // HOOK STATE
  const [coupon, setCoupon]: [string, React.Dispatch<any>] = useState('');

  // REDUCER
  const { listBooking } = useSelector((state: any) => state.customerReducer);

  // GET DATA LOAL
  const castData = getLocalStorage('cast');
  const serviceData = getLocalStorage('srv');
  const scheduleData = getLocalStorage('cse');
  const matchingData = getLocalStorage('odt');

  let scheduleTime: string = '';

  if (castData !== null) {
    const dateConvert: Date = new Date(scheduleData?.date);
    const month: string | number =
      dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
    const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();
    scheduleTime = `${dateConvert.getFullYear()} ${month}/${day} ${timeValue[scheduleData?.start_date - 1]}~${
      timeValue[scheduleData?.end_date - 1]
    }`;
  }

  const handleSubmitBooking = async (): Promise<void> => {
    const dateConvert: Date = new Date(scheduleData?.date);
    const month: string | number =
      dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
    const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();

    if (isEdit) {
      // HANDLE UPDATE BOOKING
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
        coupon_code: coupon !== '' ? coupon : undefined,
      };

      try {
        const res: any = await customerApi.customerBooking(dataSubmit);
        if (res?.status === 'success') {
          navigate(config.routes.customerBookingSuccess);
        }
      } catch (e) {
        alertFail(api, 'Fail');
      }
    } else {
      if (castData.user_id === 'none') {
        const dataSubmit: any = {
          service_id: serviceData,
          date: `${dateConvert.getFullYear()}-${month}-${day}`,
          start_time: scheduleData.start_date,
          end_time: scheduleData.end_date,
          repeat_setting: null,
          coupon_code: coupon !== '' ? coupon : undefined,
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
              coupon_code: coupon !== '' ? coupon : undefined,
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
              assign_user_id: castData?.user_id,
              start_time: scheduleData?.start_date,
              old_matching_id: castData?.matching_id,
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
          alertSuccess(api, 'Coupon code applied successfully.');
          setIsShowNotificationCoupon(true);
        }
        if (res.status === 'success' && res.data?.message === 'Coupon is invalid') {
          alertFail(api, 'Coupon is invalid.');
        }
      } else {
        alertFail(api, 'Fail');
      }
    } catch (err) {
      alertFail(api, 'Fail');
    }
  };
  useEffect((): void => {
    dispatch(getBookings());
  }, [dispatch]);

  useEffect((): void => {
    let listBookingItem = listBooking?.find((item: any): boolean => +item?.id === +id);
    let dateStart: Date = new Date(listBookingItem?.date);
    let month: string | number =
      dateStart.getMonth() + 1 > 10 ? dateStart.getMonth() + 1 : `0${dateStart.getMonth() + 1}`;
    let day: string | number = dateStart.getDate() < 10 ? `0${dateStart.getDate()}` : dateStart.getDate();
    let timeStart: string = timeValue[listBookingItem?.start_time - 1];
    let timeEnd: string = timeValue[listBookingItem?.end_time];
    let timeString: string = `${dateStart.getFullYear()} ${month}/${day} ${timeStart}~${timeEnd}`;
    setBookingItemState({ ...listBookingItem, dateTemplate: timeString });
  }, [listBooking]);

  return (
    <div className="customer-booking-detail booking-detail-extend">
      {showPopup}
      <div className="title">
        <h1>1時間延長概算料金</h1>
      </div>
      <div className="booking-details-list">
        <div className="booking-details-item">
          <div className="booking-details-line">
            <span className="field">サービス</span>
            <span className="value">{`${serviceItems[+bookingItemState?.service_id - 1]?.label}`}</span>
          </div>
          <div className="booking-details-line">
            <span className="field">予約日時</span>
            <span className="value">{`${bookingItemState?.dateTemplate}`}</span>
          </div>
          <div className="booking-details-line">
            <span className="field">依頼時間</span>
            <span className="value">{`${bookingItemState?.hour}時間`}</span>
          </div>
          <div className="booking-details-line">
            <span className="field">概算料金</span>
            <span className="value">¥00,000</span>
          </div>
          <div className="booking-details-line red">
            <span className="field">延長料金 ＋1時間</span>
            <span className="value">¥00,000</span>
          </div>

          <div className="booking-details-line">
            <span className="field">合計金額</span>
            <span className="value">¥00,000</span>
          </div>
        </div>
      </div>
      <div className="attention">
        <p>ご登録いただいたクレジットカードの決済は、サービス提供後に行います。（サービス提供日もしくはその翌日）</p>
      </div>
      <div className={isShowNotificationCoupon ? 'discount' : 'discount discount-show'}>
        <div className="discount-input">
          <Input
            placeholder={'EPA01234'}
            className="input-global discount-input-tag"
            onChange={(e: React.ChangeEvent<any>): void => {
              setCoupon(e.target.value);
            }}
          />
          <Button className="btn cr-allow" onClick={handleCheckCoupon}>
            クーポンを適用
          </Button>
        </div>
        {isShowNotificationCoupon && (
          <div className="discount-info-container">
            <div className="discount-info">
              <img src={image.infoIcon} alt="" />

              <p className="info">
                クーポンが適用されました。
                <br />
                サービスが ¥0,000 割引になります。
              </p>
            </div>
          </div>
        )}
      </div>
      {isShowNotificationCoupon && (
        <div className="payment-container">
          <div className="payment">
            <span className="field">クーポン適用金額</span>
            <span className="value">¥00,000</span>
          </div>
        </div>
      )}

      <div className="button-block">
        <Button
          className="btn"
          onClick={(): void => {
            isEdit ? navigate(`/user/mypage/reserve/select/${id}`) : navigate(config.routes.customerConfirmInformation);
          }}
        >
          内容を変更
        </Button>

        <Button className="btn cr-allow" onClick={handleSubmitBooking}>
          確定
        </Button>
      </div>
      <div className="instruct">
        <span>
          キャンセル及び変更に関する注意点は<a href="#">コチラ</a>
        </span>
      </div>
    </div>
  );
};

export default CustomerBookingDetail;
