import { Dispatch } from 'redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Form, FormInstance, Input, notification } from 'antd';

import { reportCastItem, reportCustomerItem } from '../../../utils/reportCastItem';
import { getCastJobCurrentDate } from '../../../redux/services/castSlice';
import { serviceItems } from '../../../utils/customerServiceItems';
import { alertFail, alertSuccess } from '../../../helper/common';
import CheckboxCustom from '../../../components/checkboxCustom';
import { hourArrayItems } from '../../../utils/hourArrayItems';
import { castApi } from '../../../api';
import config from '../../../config';

const { TextArea }: any = Input;

const CastRequestDetail = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formReport]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [saveReportSatisfy, setSaveReportSatisfy]: [any, React.Dispatch<any>] = useState<any>(null);
  const [saveReportCompletable, setSaveReportCompletable]: [any, React.Dispatch<any>] = useState<any>(null);
  const [showErrorSatisfy, setShowErrorSatisfy]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorCompletable, setShowErrorCompletable]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // REDUCER
  const { castJobCurrentDate } = useSelector((state: any) => state.castReducer);

  // GET DATA LOCAL
  const user_token: string | null = localStorage.getItem('access_token');

  // HOOK EFFECT
  useEffect((): void => {
    if (user_token) {
      dispatch(getCastJobCurrentDate());
    } else {
      navigate(config.routes.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // HANDLE CHANGE REPORT CAST
  const handleChangeReportCast = (values: any): void => {
    setSaveReportCompletable(values);
    if (values) {
      setShowErrorCompletable(false);
    }
  };

  // HANDLE CHANGE REPORT CUSTOMER
  const handleChangeReportCustomer = (values: any): void => {
    setSaveReportSatisfy(values);
    if (values) {
      setShowErrorSatisfy(false);
    }
  };

  // HANDLE ERROR FORM
  const handleError = ({ errorFields }: any): void => {
    const filterBookingError = errorFields?.filter(
      (item: any) => item?.name[0] === 'completable' || item?.name[0] === 'satisfy_level',
    );
    if (filterBookingError.length !== 0) {
      if (saveReportSatisfy === null) {
        setShowErrorSatisfy(true);
      }
      if (saveReportCompletable === null) {
        setShowErrorCompletable(true);
      }
    }
  };

  const id = castJobCurrentDate?.length > 0 && castJobCurrentDate?.map((item: any) => item.matching_id);

  // HANDLE SUBMIT
  const onSubmit = async (values: any): Promise<void> => {
    const userReportData: any = {
      matching_id: id[0],
      completable: saveReportCompletable,
      satisfy_level: saveReportSatisfy,
      description: values.description,
      description_other: values.description_other,
    };
    try {
      const res: any = await castApi.postCurrentJobReport(userReportData);
      if (res.status === 'success') {
        alertSuccess(api, 'Success');
        navigate(config.routes.castReportSuccess);
      }
    } catch (error: any) {
      if (error?.response?.data?.status === 'fail') {
        alertFail(api, 'Fail');
      }
    }
  };

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  return (
    <div className="cast-request-detail-container container-680">
      {showPopup}
      <h1 className="title">ご依頼詳細</h1>
      {castJobCurrentDate?.length > 0 &&
        castJobCurrentDate?.map((item: any, index: number) => (
          <div className="request-detail-content" key={index}>
            <div className="request-detail-content-element">
              <span className="field">ご予約者様氏名</span>
              <span className="value">{item?.name}</span>
            </div>
            <div className="request-detail-content-element">
              <span className="field">サービス</span>
              <span className="value">{serviceItems[item?.service_id - 1]?.label}</span>
            </div>
            <div className="request-detail-content-element date-time">
              <span className="field">予約日時</span>
              <span className="value">
                {convertDate(item?.date)} {hourArrayItems[item?.start_time - 1]?.title} ~
                {hourArrayItems[item?.end_time]?.title}
              </span>
            </div>
            <div className="request-detail-content-element">
              <span className="field">最寄駅</span>
              <span className="value">{item?.station}</span>
            </div>
            <div className="request-detail-content-element">
              <span className="field">住所</span>
              <span className="value">
                〒{item?.postal_code}
                <br />
                {item?.province} {item?.street} {item?.city}
              </span>
            </div>
            <div className="request-detail-content-element">
              <span className="field">指名</span>
              <span className="value">なし</span>
            </div>
          </div>
        ))}
      <div className="red">
        <span>*必須項目</span>
      </div>
      <div className="question">
        <Form name="report" form={formReport} autoComplete="off" onFinishFailed={handleError} onFinish={onSubmit}>
          <div className="question-checkbox">
            <div className="question-form">
              <span className="star">*</span>
              <span> お客様の依頼を完了しましたか？</span>
            </div>
            <Form.Item
              name={'completable'}
              rules={[
                {
                  required: true,
                  message: 'レポートの入力が空白ではありません',
                },
              ]}
            >
              <CheckboxCustom
                vertical
                options={reportCastItem}
                error={showErrorCompletable}
                value={saveReportCompletable}
                onChange={handleChangeReportCast}
              />
            </Form.Item>
          </div>
          <div className="question-checkbox">
            <div className="question-form">
              <div>
                <span className="star">*</span>
                <span>お客様は満足していますか？</span>
              </div>
            </div>
            <Form.Item
              name={'satisfy_level'}
              rules={[
                {
                  required: true,
                  message: 'レポートの入力が空白ではありません',
                },
              ]}
            >
              <CheckboxCustom
                vertical
                error={showErrorSatisfy}
                value={saveReportSatisfy}
                options={reportCustomerItem}
                onChange={handleChangeReportCustomer}
              />
            </Form.Item>
          </div>
          <div className="question-textarea">
            <div className="question-form">
              <span className="star">*</span>
              <span>お客様から感想やお礼、改善点などを頂いたりした場合には、こちらに記入をお願いします。</span>
            </div>
            <Form.Item
              name={'description'}
              rules={[
                {
                  required: true,
                  message: 'レポートの入力が空白ではありません',
                },
              ]}
            >
              <TextArea className="textarea-global" placeholder="こちらにご記入ください" />
            </Form.Item>
          </div>
          <div className="question-textarea">
            <div className="question-form">
              <span>その他、お客様から頂いたコメントを記載ください</span>
            </div>
            <Form.Item name={'description_other'}>
              <TextArea className="textarea-global" placeholder="こちらにご記入ください" />
            </Form.Item>
          </div>
          <div className="button-block">
            <Button className="btn ct-allow btn-large" htmlType="submit">
              依頼完了報告をする
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CastRequestDetail;
