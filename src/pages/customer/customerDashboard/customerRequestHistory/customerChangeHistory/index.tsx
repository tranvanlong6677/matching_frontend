import { Dispatch } from 'redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormInstance, Input } from 'antd';
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';

import { getBookingByIdForHistory } from '../../../../../redux/services/customerSlice';
import CalendarModal from '../../../customerSchedule/scheduleDetail/calendarModal';
import { getLocalStorage, setLocalStorage } from '../../../../../helper/common';
import ModalSuccess from '../../../../../components/modalSuccess/modalSuccess';
import { repeatSettingItems } from '../../../../../utils/repeatSettingItems';
import { hourScheduleItems } from '../../../../../utils/hourScheduleItems';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { timeValue } from '../../../../../utils/timeValue';
import { dayItems } from '../../../../../utils/dayItems';
import config from '../../../../../config';

const CustomerChangeHistory = () => {
  const { id }: any = useParams();
  const dispatch: Dispatch = useDispatch();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const [formEditBooking]: [FormInstance] = Form.useForm();

  // HOOK STATE
  const [saveCast, setSaveCast]: [any, React.Dispatch<any>] = useState<any>(null);
  const [isLate, setIsLate]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [checkDatetimeData, setCheckDatetimeData]: [boolean, React.Dispatch<any>] = useState<any>(false);
  const [showCalendarModal, setShowCalendarModal]: [boolean, React.Dispatch<any>] = useState<any>(false);

  // REDUCERS
  const { bookingById } = useSelector((state: any) => state.customerReducer);

  // GET DATA LOCAL
  const castData = getLocalStorage('cast');
  const scheduleData = getLocalStorage('cse');
  const serviceData = getLocalStorage('srv');

  //--------------------------- HOOK EFFECT---------------------------

  // FETCH DATA
  useEffect((): void => {
    if (!scheduleData) {
      const handleFetch = async (): Promise<void> => {
        await dispatch(getBookingByIdForHistory(id));
      };
      handleFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // HANDLE SCHEDULE DATA
  useEffect((): void => {
    if (castData !== null) {
      formEditBooking.setFieldValue('cast_id', castData?.name);
      setSaveCast(castData?.user_id);
    }
    if (scheduleData !== null) {
      const date: Date = new Date(scheduleData?.date);
      const scheduleValue: string = `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${
        dayItems[date.getDay()]
      }) ${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]} ${
        scheduleData?.repeat_setting !== null ? '/' : ''
      } ${scheduleData?.repeat_setting !== null ? repeatSettingItems[scheduleData?.repeat_setting - 1]?.label : ''}`;
      if (scheduleData?.request_description !== undefined) {
        formEditBooking.setFieldValue('request_description', scheduleData?.request_description);
      }
      if (scheduleData?.date !== null) {
        formEditBooking.setFieldValue('date_time', scheduleValue);
        setCheckDatetimeData(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castData, scheduleData, bookingById]);

  // HANDLE SUBMIT
  const onFinish = (): void => {
    if (saveCast !== null && formEditBooking.getFieldValue('date_time') !== undefined) {
      navigate(config.routes.customerConfirmHistory);
      setLocalStorage('idh', id);
    }
  };

  return (
    <div className="reserve-select-container container-630">
      <ModalSuccess
        cast
        type={'delete_booking'}
        showChangeWarning={isLate}
        setShowChangeWarning={setIsLate}
        idBookingMatchUpdate={id}
        isUserUpdateBooking={true}
      />
      <h1 className="title">予約内容変更</h1>
      <Form name="basic" onFinish={onFinish} autoComplete="off" form={formEditBooking}>
        <div className="service-info">
          <span className="field">サービス</span>
          <span className="value">{serviceData?.service_id !== null ? serviceItems[+serviceData - 1]?.label : ''}</span>
        </div>
        <div className="form-change">
          <Form.Item name="cast_id">
            <Input className="input-global" readOnly />
          </Form.Item>
          <div
            className="change-time-container"
            style={{
              marginTop: '22px',
            }}
          >
            <label htmlFor="" className="change-time-label warning">
              予約日時を変更してください
            </label>

            <div
              className="change-time-element"
              onClick={() => {
                setShowCalendarModal(true);
              }}
            >
              <Form.Item name="date_time">
                <Input maxLength={0} className="input-global" readOnly />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="time-request">
          <span className="field">ご依頼時間</span>
          <span className="value">
            {scheduleData?.hour !== undefined && hourScheduleItems[scheduleData.hour - 1]?.title}
          </span>
        </div>
        <span className="instruct">
          キャンセル及び変更に関する注意点は<a href="#">コチラ</a>
        </span>
        <div className="button-block">
          <Button
            type="primary"
            className="btn"
            onClick={(): void => {
              if (location.pathname.search(config.routes.customerChangeHistory) !== -1) {
                navigate(config.routes.customerRequestHistory);
              } else {
                navigate(config.routes.customerChangeService);
              }
            }}
          >
            戻る
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={`btn${saveCast !== null && checkDatetimeData ? ' btn-customer' : ' not-allowed'}`}
          >
            次へ
          </Button>
        </div>
      </Form>
      <CalendarModal
        chooseCast={saveCast}
        showCalendarModal={showCalendarModal}
        setShowCalendarModal={setShowCalendarModal}
        setCheckDatetimeData={setCheckDatetimeData}
      />
    </div>
  );
};
export default CustomerChangeHistory;
