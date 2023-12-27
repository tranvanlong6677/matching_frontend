/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Form, FormInstance, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dispatch } from 'redux';

import image from '../../../../../assets/images/index';
import ModalSuccess from '../../../../../components/modalSuccess/modalSuccess';
import config from '../../../../../config';
import { getLocalStorage } from '../../../../../helper/common';
import { getBookingById, getCastWorked } from '../../../../../redux/services/customerSlice';
import { serviceItems } from '../../../../../utils/customerServiceItems';
import { dayItems } from '../../../../../utils/dayItems';
import { hourScheduleItems } from '../../../../../utils/hourScheduleItems';
import { repeatSettingItems } from '../../../../../utils/repeatSettingItems';
import { timeValue } from '../../../../../utils/timeValue';
import CalendarModal from '../../../customerSchedule/scheduleDetail/calendarModal';

const CustomerChangeBooking = () => {
  const { id }: any = useParams();
  const dispatch: Dispatch = useDispatch();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const [formEditBooking]: [FormInstance] = Form.useForm();
  // HOOK STATE
  const [showCast, setShowCast]: [boolean, React.Dispatch<any>] = useState<any>(false);
  const [saveCast, setSaveCast]: [any, React.Dispatch<any>] = useState<any>(null);
  const [isLate, setIsLate]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [checkDatetimeData, setCheckDatetimeData]: [boolean, React.Dispatch<any>] = useState<any>(false);
  const [showCalendarModal, setShowCalendarModal]: [boolean, React.Dispatch<any>] = useState<any>(false);
  // REDUCER
  const { listCastWorked, bookingById } = useSelector((state: any) => state.customerReducer);

  // GET DATA LOCAL
  const castData = getLocalStorage('cast');
  const scheduleData = getLocalStorage('cse');
  const serviceData = getLocalStorage('srv');
  // HOOK EFFECT

  useEffect((): void => {
    const handleFetch = async (): Promise<void> => {
      await dispatch(getBookingById(id));
    };
    handleFetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect((): void => {
    const getCastWorkedFunc = async (): Promise<void> => {
      await dispatch(getCastWorked({ service_id: serviceData }));
    };
    if (serviceData !== null) {
      getCastWorkedFunc();
    }
  }, [serviceData, dispatch]);

  useEffect((): void => {
    if (castData !== null) {
      formEditBooking.setFieldValue('cast_id', castData?.title);
      setSaveCast(castData?.user_id);
    }
    if (scheduleData !== null) {
      const date: Date = new Date(scheduleData?.date);
      const scheduleValue: string = !scheduleData?.date
        ? ''
        : `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${dayItems[date.getDay()]}) ${
            timeValue[scheduleData?.start_date - 1]
          }~${timeValue[scheduleData?.end_date]} ${scheduleData?.repeat_setting !== null ? '/' : ''} ${
            scheduleData?.repeat_setting !== null ? repeatSettingItems[scheduleData?.repeat_setting - 1]?.label : ''
          }`;
      if (scheduleData?.request_description !== undefined) {
        formEditBooking.setFieldValue('request_description', scheduleData?.request_description);
      }
      if (scheduleData?.date !== null) {
        formEditBooking.setFieldValue('date_time', scheduleValue);
        setCheckDatetimeData(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castData, scheduleData]);

  // HANDLE SUBMIT
  const onFinish = (): void => {
    if (saveCast !== null && formEditBooking.getFieldValue('date_time') !== undefined) {
      if (location.pathname.search(config.routes.customerChangeHistory) !== -1) {
        navigate(`/user/mypage/reserve/select/${id}/update`);
        // navigate(`/user/mypage/reserve/history/select/${id}/confirm`);
      } else {
        navigate(`/user/mypage/reserve/select/${id}/update`);
      }
    }
  };

  return (
    <div className="reserve-select-container container-630">
      <Modal
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        open={showCast}
        footer={false}
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
        className="modal-date"
        onCancel={(): void => {
          setShowCast(false);
        }}
      >
        {listCastWorked?.length === 0 || !listCastWorked ? (
          <p key={'none'}>指名しない</p>
        ) : (
          listCastWorked?.map((castItem: any, index: number) => {
            return <p key={index}>{castItem?.title}</p>;
          })
        )}
      </Modal>

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
          <span className="value">
            {bookingById?.service_id !== null ? serviceItems[bookingById?.service_id - 1]?.label : ''}
          </span>
        </div>
        <div className="form-change">
          {bookingById?.assign_name !== null ? (
            <>
              <label htmlFor="" className="change-employee-label">
                キャストを変更する
              </label>
              <div
                style={{
                  marginTop: '16px',
                }}
                onClick={(): void => {
                  if (location.pathname.search(config.routes.customerChangeHistory) === -1) {
                  }
                }}
              >
                <Form.Item name="cast_id">
                  <Input className="input-global" readOnly />
                </Form.Item>
              </div>
            </>
          ) : (
            <></>
          )}

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
              onClick={(): void => {
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

export default CustomerChangeBooking;
