import { Dispatch } from 'redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormInstance, Input, Modal } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { customerServiceIcons2 } from '../../../../utils/customerServiceIcons';
import { getLocalStorage, setLocalStorage } from '../../../../helper/common';
import { repeatSettingItems } from '../../../../utils/repeatSettingItems';
import { getCastWorked } from '../../../../redux/services/customerSlice';
import { timeValue } from '../../../../utils/timeValue';
import { dayItems } from '../../../../utils/dayItems';
import image from '../../../../assets/images/index';
import CalendarModal from './calendarModal';
import config from '../../../../config';

const ScheduleDetail = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formScheduleDetail]: [FormInstance] = Form.useForm();
  const requestDescValue = Form.useWatch('request_description', formScheduleDetail);

  // HOOK STATE
  const [saveCast, setSaveCast]: [any, React.Dispatch<any>] = useState<any>(null);
  const [showCast, setShowCast]: [boolean, React.Dispatch<any>] = useState<any>(false);
  const [showCalendarModal, setShowCalendarModal]: [boolean, React.Dispatch<any>] = useState<any>(false);

  const { listCastWorked } = useSelector((state: any) => state.customerReducer);

  // GET DATA LOCAL
  const castData = getLocalStorage('cast');
  const scheduleData = getLocalStorage('cse');
  const serviceData = getLocalStorage('srv');

  useEffect((): void => {
    if (serviceData !== null) {
      dispatch(getCastWorked({ service_id: serviceData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (castData !== null) {
      formScheduleDetail.setFieldValue('cast_id', castData?.name);
      setSaveCast(castData?.user_id);
    }
    if (scheduleData !== null) {
      convertTimeValue(scheduleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertTimeValue = (scheduleData: any): void => {
    const date: Date = new Date(scheduleData?.date);
    const scheduleValue: string = `${date?.getFullYear()}年${date?.getMonth() + 1}月${date?.getDate()}日 (${
      dayItems[date.getDay()]
    }) ${timeValue[scheduleData?.start_date - 1]}~${timeValue[scheduleData?.end_date]} ${
      scheduleData?.repeat_setting !== null ? '/' : ''
    } ${scheduleData?.repeat_setting !== null ? repeatSettingItems[scheduleData?.repeat_setting - 1]?.label : ''}`;

    formScheduleDetail.setFieldValue('date_time', scheduleValue);
    if (scheduleData?.request_description !== undefined) {
      formScheduleDetail.setFieldValue('request_description', scheduleData?.request_description);
    }
  };
  const handleSetDateTime = (values: any): void => {
    convertTimeValue(values);
  };

  const onSubmit = (values: any): void => {
    if (values?.request_description !== undefined) {
      const tmpScheduleData = {
        ...scheduleData,
        request_description: values?.request_description,
      };

      setLocalStorage('cse', tmpScheduleData);
      navigate(config.routes.customerConfirmInformation);
    }
  };

  const handleChooseCast = (castItem: any): void => {
    setShowCast(false);
    setSaveCast(castItem.user_id);
    setLocalStorage('cast', castItem);
    formScheduleDetail.setFieldValue('cast_id', castItem?.name);
    if (castItem.user_id !== 'none') {
      setShowCalendarModal(true);
    }
    if (castItem.user_id === 'none') {
      localStorage.removeItem('cse');
      formScheduleDetail.setFieldValue('date_time', undefined);
      formScheduleDetail.setFieldValue('request_description', undefined);
    }
  };

  return (
    <div className="booking-soji-container container-630">
      <div className="title">
        <img src={customerServiceIcons2[serviceData - 1]?.icon} alt="" />
        <h1>{customerServiceIcons2[serviceData - 1]?.title}</h1>
      </div>
      <Form
        name="basic"
        initialValues={{
          remember: false,
        }}
        onFinish={onSubmit}
        autoComplete="off"
        form={formScheduleDetail}
      >
        {/* --------------------- CHOOSE CAST ---------------- */}

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
            <p
              key={'none'}
              onClick={(): void => {
                setShowCast(false);
                setSaveCast('none');
                setLocalStorage('cast', { user_id: 'none', name: '指名しない' });
                formScheduleDetail.setFieldValue('cast_id', '指名しない');
                formScheduleDetail.setFieldValue('date_time', undefined);
                formScheduleDetail.setFieldValue('request_description', undefined);
                localStorage.removeItem('cse');
              }}
            >
              指名しない
            </p>
          ) : (
            listCastWorked?.map((castItem: any, index: number) => {
              return (
                <p
                  key={index}
                  onClick={(): void => {
                    handleChooseCast(castItem);
                  }}
                >
                  {castItem?.title}
                </p>
              );
            })
          )}
        </Modal>
        <label htmlFor="" className="label-form-cleaning-service">
          キャストを指名する（2回目以降利用可能）
        </label>
        <div
          onClick={(): void => {
            setShowCast(true);
          }}
        >
          <Form.Item name={'cast_id'} rules={[{ required: true }]}>
            <Input className="input-global" maxLength={0} readOnly={true} placeholder="指名しない" />
          </Form.Item>
        </div>
        <span className="note">※直近で依頼した10件が表示されます。</span>

        <label htmlFor="" className="label-form-cleaning-service">
          予約日時
        </label>
        <div
          onClick={(): void => {
            setShowCalendarModal(true);
          }}
        >
          <Form.Item name={'date_time'} rules={[{ required: false }]}>
            <Input
              maxLength={0}
              className="input-global"
              readOnly
              placeholder={getLocalStorage('srv') === 1 ? 'カレンダーを表示' : '日時を選択'}
            />
          </Form.Item>
        </div>
        <span className="note">※登録後、マイページの予約詳細画面より、サービスの延長ができます。</span>
        <label htmlFor="" className="label-form-cleaning-service">
          備考
        </label>
        <Form.Item name={'request_description'} rules={[{ required: false }]}>
          <Input.TextArea
            className="textarea-global"
            placeholder="当日キャストにお伝えしたいことがあれば
ご記入ください。"
          />
        </Form.Item>
        <div className="button-block">
          <Button
            className="btn"
            onClick={(): void => {
              navigate(config.routes.customerScheduleService);
            }}
          >
            戻る
          </Button>
          <Button
            htmlType="submit"
            disabled={
              saveCast !== null &&
              formScheduleDetail.getFieldValue('date_time') !== undefined &&
              requestDescValue !== '' &&
              requestDescValue !== undefined
                ? false
                : true
            }
            className={`btn${
              saveCast !== null &&
              formScheduleDetail.getFieldValue('date_time') !== undefined &&
              requestDescValue !== undefined &&
              requestDescValue !== ''
                ? ' btn-customer'
                : ''
            }`}
          >
            次へ
          </Button>
        </div>
      </Form>
      <CalendarModal
        chooseCast={saveCast}
        handleSetDateTime={handleSetDateTime}
        showCalendarModal={showCalendarModal}
        setShowCalendarModal={setShowCalendarModal}
        modalBookingSoji={true}
      />
    </div>
  );
};

export default ScheduleDetail;
