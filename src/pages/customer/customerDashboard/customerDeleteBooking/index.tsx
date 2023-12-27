import { Dispatch } from 'redux';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormInstance, Input } from 'antd';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import { setLocalStorage, getLocalStorage, formatCash } from '../../../../helper/common';
import { getBookingById } from '../../../../redux/services/customerSlice';
import { hourScheduleItems } from '../../../../utils/hourScheduleItems';
import { serviceItems } from '../../../../utils/customerServiceItems';
import CheckboxCustom from '../../../../components/checkboxCustom';
import { hourArrayItems } from '../../../../utils/hourArrayItems';
import { ReasonItems } from '../../../../utils/reasonItems';
import config from '../../../../config';
const { TextArea } = Input;

const CustomerDeleteBooking = () => {
  const daysOfWeek: string[] = ['日', '月', '火', '水', '木', '金', '土'];

  const dispatch: Dispatch = useDispatch();
  const { id }: any = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [formReason]: [FormInstance] = Form.useForm();

  const [dateString, setDateString]: any = useState<string>();
  const [showReason, setShowReason]: any = useState(false);
  const [saveReason, setSaveReason]: any = useState<any>(null);
  const [showErrorBooking, setShowErrorBooking]: any = useState<boolean>(false);

  // GET DATA LOCAL
  const userDeleteStatus = getLocalStorage('dltstt');

  // REDUCER
  const { bookingById, loading } = useSelector((state: any) => state.customerReducer);

  //  HOOK EFFECT
  useEffect((): void => {
    if (userDeleteStatus !== null) {
      if (userDeleteStatus.reason_value === 'other') {
        formReason.setFieldValue('reason_delete', 1);
        formReason.setFieldValue('reason_detail', userDeleteStatus?.reason_delete);
        setShowReason(true);
        setSaveReason(1);
      } else {
        setSaveReason(userDeleteStatus?.reason_delete);
        formReason.setFieldValue('reason_delete', userDeleteStatus?.reason_delete);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    dispatch(getBookingById(id));
  }, [dispatch, id]);

  useEffect((): void => {
    let dateValue: Date = new Date(bookingById?.date);
    const dayOfWeek: string = daysOfWeek[+dateValue.getDay()];
    setDateString(
      `${dateValue?.getFullYear()}年${dateValue?.getMonth() + 1}月${dateValue?.getDate()}日 (${dayOfWeek})`,
    );
  }, [bookingById]);

  // HANDLE CHANGE REASON
  const handleChangeReason = (values: any): void => {
    setSaveReason(values);
    if (values === 1) {
      setShowReason(true);
    } else {
      setShowReason(false);
      formReason.setFields([
        {
          name: 'reason_detail',
          errors: undefined,
        },
        {
          name: 'reason_delete',
          errors: undefined,
        },
      ]);
    }
  };

  const onSubmit = (values: any): void => {
    const userReasonData: any = {
      reason_delete: saveReason === 1 ? values.reason_detail : saveReason,
      reason_value: saveReason === 1 ? 'other' : undefined,
      id,
    };
    setLocalStorage('dltstt', userReasonData);
    navigate(`/user/mypage/reserve/select/${id}/cancel-confirm`);
  };

  // HANDLE ERROR
  const handleError = ({ _, errorFields, __ }: any): void => {
    const filterBookingError = errorFields?.filter(
      (item: any) => item.name[0] === 'reason_delete' || item?.name[0] === 'reason_detail',
    );

    if (filterBookingError.length !== 0) {
      if (saveReason === 1) {
        setShowErrorBooking(false);
        formReason.setFields([
          {
            name: 'reason_detail',
            errors: ['Reason delete not blank'],
          },
        ]);
      } else if (saveReason === null) {
        setShowErrorBooking(true);
        formReason.setFields([
          {
            name: 'reason_delete',
            errors: ['Reason delete not blank'],
          },
        ]);
      } else {
        formReason.setFields([
          {
            name: 'reason_delete',
            errors: undefined,
          },
          {
            name: 'reason_detail',
            errors: undefined,
          },
        ]);
      }
    } else {
      setShowErrorBooking(false);
      formReason.setFields([
        {
          name: 'reason_delete',
          errors: undefined,
        },
        {
          name: 'reason_detail',
          errors: undefined,
        },
      ]);
    }
  };

  return (
    <div className="confirm-booking-container container-680">
      <h1 className="title">以下の予約をキャンセルしますか？</h1>
      <div className="info-content" key={bookingById?.id}>
        <div className="info-content-element">
          <span className="field">サービス</span>
          <span className="value">{serviceItems[bookingById?.service_id - 1]?.label}</span>
        </div>
        <div className="info-content-element">
          <span className="field">予約日時</span>
          <span className="value">
            {!loading
              ? `${dateString} ${hourArrayItems[bookingById?.start_time - 1]?.title} ~ ${
                  hourArrayItems[bookingById?.end_time]?.title
                }`
              : ``}
          </span>
        </div>
        <div className="info-content-element">
          <span className="field">依頼時間</span>
          <span className="value">{hourScheduleItems[bookingById?.hour - 2]?.title}</span>
        </div>
        <div className="info-content-element no-border">
          <span className="field">内訳</span>
        </div>

        <div className="info-content-element">
          <span className="field">キャンセルのためキャスト指名料は解除されました</span>
          <span className="value">¥0</span>
        </div>
        <div className="info-content-element">
          <span className="field">サービス料</span>
          <span className="value">¥{formatCash(`${bookingById?.hour * 6000}`)}</span>
        </div>
        <div className="info-content-element">
          <span className="field">キャンセルのためクーポンは解除されました</span>
          <span className="value">¥0</span>
        </div>
        <div className="info-content-element">
          <span className="field">概算料金</span>
          <span className="value">¥{formatCash(`${bookingById?.hour * 6000}`)}</span>
        </div>
        <div className="line-price"></div>
        <div className="info-content-element red">
          <span className="field red">キャンセル料金</span>
          <span className="value">¥{formatCash(`${bookingById?.cancel_cost}`)}</span>
        </div>
      </div>

      <div className="price-total-block">
        <span className="field">最終確定料金</span>
        <span className="value">¥{formatCash(`${bookingById?.cancel_cost}`)} (税込)</span>
      </div>
      <div className="attention-reason-wrapper">
        <div className="attention">
          <p>
            ※キャンセル可能期日を過ぎたキャンセルの場合には、キャンセル確定後
            キャンセル料金を、ご登録いただいたクレジットカードにご請求いたします。
          </p>
        </div>

        <div className="reason">
          <div className="title-reason">
            <span>キャンセル理由（複数回答可）</span>
            <span className="red">*必須項目</span>
          </div>
          <Form name="reason" form={formReason} onFinish={onSubmit} onFinishFailed={handleError} autoComplete="off">
            <Form.Item
              name="reason_delete"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <CheckboxCustom
                options={ReasonItems}
                onChange={handleChangeReason}
                value={saveReason}
                vertical
                error={showErrorBooking}
              />
            </Form.Item>
            {showReason ? (
              <Form.Item
                className={showReason ? '' : 'hidden'}
                name="reason_detail"
                rules={[
                  {
                    required: true,
                    message: '',
                  },
                ]}
              >
                <TextArea className="textarea-global" />
              </Form.Item>
            ) : (
              ''
            )}
            <div className="reason-detail"></div>
            <div className="button-block">
              <Button type="primary" className="btn" onClick={() => navigate(config.routes.customerChangeService)}>
                キャンセルせずに戻る
              </Button>
              <Button
                htmlType="submit"
                disabled={saveReason !== null ? false : true}
                className={`btn${saveReason !== null ? ' cr-allow' : ''}`}
              >
                次へ
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeleteBooking;
