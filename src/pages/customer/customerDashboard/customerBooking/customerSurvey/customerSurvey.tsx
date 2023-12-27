import { Form, notification } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import * as React from 'react';
import { useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import CheckboxCustom from '../../../../../components/checkboxCustom';
import config from '../../../../../config';
import { alertFail, alertSuccess, getLocalStorage, setLocalStorage } from '../../../../../helper/common';
import { postFinishJobMatching } from '../../../../../redux/services/customerSlice';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
const CustomerSurvey = () => {
  const { id }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = notification.useNotification();

  const [saveIsDone, setSaveIsDone]: [any, React.Dispatch<any>] = useState<any>(null);
  const [saveIsDamegedGood, setSaveDamagedGood]: [any, React.Dispatch<any>] = useState<any>(null);
  const [saveIsLost, setSaveSetIsLost]: [any, React.Dispatch<any>] = useState<any>(null);
  const [formSurvey]: [FormInstance] = Form.useForm();
  const [showErrorDone, setShowErrorDone]: any = useState<boolean>(false);
  const [showErrorDame, setShowErrorDame]: any = useState<boolean>(false);
  const [showErrorLost, setShowErrorLost]: any = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const userSurveyStatus = getLocalStorage('svstt');
  const userMatchingInfor = getLocalStorage('mrsdt');

  React.useEffect((): void => {
    if (userSurveyStatus !== null) {
      setSaveIsDone(userSurveyStatus?.saveIsDone);
      setSaveDamagedGood(userSurveyStatus?.saveIsDamegedGood);
      setSaveSetIsLost(userSurveyStatus?.saveIsLost);
      formSurvey.setFieldValue('survey_1', userSurveyStatus?.survey_1);
      formSurvey.setFieldValue('survey_2', userSurveyStatus?.survey_2);
      formSurvey.setFieldValue('survey_3', userSurveyStatus?.survey_3);
    }
  }, []);

  const listIsDone: any = [
    {
      label: 'はい',
      value: '1',
    },
    {
      label: 'いいえ',
      value: '0',
    },
  ];
  const handleChangeIsDone = (value: any): void => {
    setShowErrorDone(false);
    setSaveIsDone(value);
  };
  const handleDamagedGood = (value: any): void => {
    setShowErrorDame(false);
    setSaveDamagedGood(value);
  };
  const handleIsLost = (value: any): void => {
    setShowErrorLost(false);
    setSaveSetIsLost(value);
  };

  const onSubmit = async (values: any): Promise<void> => {
    const userSurvey: any = {
      customer_service_id: Number(id),
      survey_1: values.survey_1 || saveIsDone,
      survey_2: values.survey_2 || saveIsDamegedGood,
      survey_3: values.survey_3 || saveIsLost,
    };

    setLocalStorage('svstt', userSurvey);

    if (saveIsDone !== null && saveIsDamegedGood !== null && saveIsLost !== null) {
      const res: any = await dispatch(postFinishJobMatching(userSurvey));
      if (res?.payload?.status === 'success') {
        alertSuccess(api, '変更が完了しました。');
        navigate(config.routes.customerSurveySuccess);
        localStorage.removeItem('svstt');
        localStorage.removeItem('mrsdt');
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    } else {
      navigate(config.routes.customerDashboard);
    }
  };

  return (
    <div className="survey-customer-container container-680">
      {showPopup}
      <h1 className="survey-title">作業完了チェックシート</h1>
      <div className="survey-item">
        <div className="survey-item-content">
          <p>依頼日</p>
          <p>{userMatchingInfor?.date}</p>
        </div>
        <div className="survey-item-content">
          <p>キャスト</p>
          <p>{userMatchingInfor?.name}</p>
        </div>
      </div>
      <div className="survey-item">
        <p className="survey-note">
          この度は サービスをご利用いただき、ありがとうございま した。サービス完了につき、各項目にチェックいただき送
          信ください。
        </p>
      </div>
      <Form name="survey" form={formSurvey} onFinish={onSubmit} autoComplete="off">
        <div className="survey-item">
          <h3 className="survey-require">
            今回のご依頼内容の作業は完了でよろしい
            <br />
            でしょうか？
          </h3>
          <Form.Item name="survey_1">
            <CheckboxCustom
              horizontal
              value={saveIsDone}
              options={listIsDone}
              onChange={handleChangeIsDone}
              error={showErrorDone}
            />
          </Form.Item>
        </div>
        <div className="survey-item">
          <h3 className="survey-require">破損物はありませんでしたか？</h3>
          <Form.Item name="survey_2">
            <CheckboxCustom
              horizontal
              value={saveIsDamegedGood}
              options={listIsDone}
              onChange={handleDamagedGood}
              error={showErrorDame}
            />
          </Form.Item>
        </div>
        <div className="survey-item">
          <h3 className="survey-require">紛失物はありませんでしたか?</h3>
          <Form.Item name="survey_3">
            <CheckboxCustom
              horizontal
              value={saveIsLost}
              options={listIsDone}
              onChange={handleIsLost}
              error={showErrorLost}
            />
          </Form.Item>
        </div>
        <div className="btn-survey-block">
          <button className="btn cr-allow btn-survey" type="submit">
            送信
          </button>
        </div>
      </Form>
    </div>
  );
};
export default CustomerSurvey;
