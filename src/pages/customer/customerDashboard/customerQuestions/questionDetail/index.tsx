import CheckboxCustom from '../../../../../components/checkboxCustom';
import { Button, Form, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import config from '../../../../../config';
import { getLocalStorage, setLocalStorage } from '../../../../../helper/common';
import { postQuestionSurveyAnswer, getMatchingCompleteCustomerById } from '../../../../../redux/services/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

const daysOfWeek: string[] = ['日', '月', '火', '水', '木', '金', '土'];

const QuestionDetail = () => {
  const { id }: any = useParams();
  const [formSurvey]: any = useForm();
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  const [dataSurveyCurrent, setDataSurveyCurrent]: any = useState<any>();
  const [dateString, setDateString]: any = useState<string>('');
  const [isFullData, setIsFullData]: any = useState<boolean>(false);
  const [isActiveQues34, setIsActiveQues34]: any = useState<boolean>(true);

  // REDUCER
  const { dataCastMatchingById } = useSelector((state: any) => state.customerReducer);

  const optionQuestion1: any = [
    {
      label: '満足',
      value: 1,
    },
    {
      label: 'やや満足',
      value: 2,
    },
    {
      label: '不満',
      value: 3,
    },
  ];
  const optionQuestion2: any = [
    {
      label: 'はい',
      value: 1,
    },
    {
      label: 'いいえ',
      value: 2,
    },
  ];

  const onSubmit = async (values: any): Promise<void> => {
    if (isFullData) {
      let res = await dispatch(postQuestionSurveyAnswer({ ...values, id }));
      if (res?.payload?.status === 'success') {
        localStorage.removeItem('data_survey_current');
        navigate(config.routes.customerQuestionSuccess);
      }
    }
  };

  useEffect((): void => {
    // handle data form
    setDataSurveyCurrent(getLocalStorage('data_survey_current'));
    if (getLocalStorage('data_survey_current')?.quality === 3) {
      setIsActiveQues34(false);
    }
    setIsFullData(
      (getLocalStorage('data_survey_current')?.quality &&
        getLocalStorage('data_survey_current')?.attitude_behavior &&
        getLocalStorage('data_survey_current')?.reuse &&
        getLocalStorage('data_survey_current')?.usually_use) ||
        (getLocalStorage('data_survey_current')?.quality === 3 &&
          getLocalStorage('data_survey_current')?.attitude_behavior),
    );
  }, []);

  useEffect((): void => {
    // set data cast matching
    dispatch(getMatchingCompleteCustomerById(id));
  }, [id, dispatch]);

  useEffect((): void => {
    let dateTemplate: Date = new Date(dataCastMatchingById?.date);
    let dayOfWeek: string = daysOfWeek[+dateTemplate.getDay()];
    let dateStringConvert: string = `${dateTemplate?.getFullYear()}年${
      dateTemplate?.getMonth() + 1
    }月${dateTemplate?.getDate()}日 (${dayOfWeek})`;
    if (dayOfWeek) {
      setDateString(dateStringConvert);
    }
  }, [dataCastMatchingById]);

  return (
    <div className="question-detail-wrapper container-680">
      {showPopup}
      <div className="title">
        <div className="title-element">
          <span className="field">依頼日</span>
          <span className="value">{dataCastMatchingById?.date && dateString ? dateString : ''}</span>
        </div>
        <div className="title-element">
          <span className="field">キャスト</span>
          <span className="value">{dataCastMatchingById?.cast_name ? `${dataCastMatchingById?.cast_name}` : ''}</span>
        </div>
      </div>
      {dataCastMatchingById?.q1 === null ? (
        <div className="introduction">
          <span>
            この度はサービスをご利用いただき、ありがとうございました。サービスの品質向上を目的として、ユーザーの皆様にアンケートをお願いしております。
          </span>
          <br />
          <span>該当する項目にチェックを入れて送信ください。</span>
        </div>
      ) : (
        <></>
      )}

      <Form onFinish={onSubmit} name="survey" form={formSurvey} style={{ width: '100%' }}>
        <div className="question-list">
          <Form.Item name="quality">
            <div className="question">
              <span className="label">Q1 </span>
              <span className="text">ご提供したサービスの質はいかがでしたか？</span>
            </div>
            <div className="answer-option">
              {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
                <CheckboxCustom
                  options={optionQuestion1}
                  horizontal
                  onChange={(values: any) => {
                    formSurvey.setFieldValue('quality', values);
                    setDataSurveyCurrent({ ...dataSurveyCurrent, quality: values });
                    setLocalStorage('data_survey_current', { ...dataSurveyCurrent, quality: values });
                    setIsFullData(
                      (formSurvey.getFieldValue('quality') &&
                        formSurvey.getFieldValue('attitude_behavior') &&
                        formSurvey.getFieldValue('reuse') &&
                        formSurvey.getFieldValue('usually_use')) ||
                        (formSurvey.getFieldValue('quality') === 3 && formSurvey.getFieldValue('attitude_behavior')),
                    );
                    if (getLocalStorage('data_survey_current')?.quality === 3) {
                      setLocalStorage('data_survey_current', { ...dataSurveyCurrent, usually_use: null, reuse: null });
                      setDataSurveyCurrent(getLocalStorage('data_survey_current'));
                      formSurvey.setFieldValue('reuse', '');
                      formSurvey.setFieldValue('usually_use', '');
                      setIsActiveQues34(false);
                    } else {
                      setIsActiveQues34(true);
                    }
                  }}
                  value={getLocalStorage('data_survey_current')?.quality}
                />
              ) : (
                <span className="answer-result">
                  {dataCastMatchingById?.q1 ? `${optionQuestion1[+dataCastMatchingById?.q1 - 1]?.label}` : ''}
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item name="attitude_behavior">
            <div className="question">
              <span className="label">Q2 </span>
              <span className="text">キャストの態度や言動はいかがでしたか？</span>
            </div>
            <div className="answer-option">
              {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
                <CheckboxCustom
                  options={optionQuestion1}
                  horizontal
                  onChange={(values: any): void => {
                    formSurvey.setFieldValue('attitude_behavior', values);
                    setDataSurveyCurrent({ ...dataSurveyCurrent, attitude_behavior: values });
                    setLocalStorage('data_survey_current', { ...dataSurveyCurrent, attitude_behavior: values });
                    setIsFullData(
                      (formSurvey.getFieldValue('quality') &&
                        formSurvey.getFieldValue('attitude_behavior') &&
                        formSurvey.getFieldValue('reuse') &&
                        formSurvey.getFieldValue('usually_use')) ||
                        (formSurvey.getFieldValue('quality') === 3 && formSurvey.getFieldValue('attitude_behavior')),
                    );
                  }}
                  value={getLocalStorage('data_survey_current')?.attitude_behavior}
                />
              ) : (
                <span className="answer-result">
                  {dataCastMatchingById?.q2 ? `${optionQuestion1[+dataCastMatchingById?.q2 - 1]?.label}` : ''}
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item name="reuse" className={isActiveQues34 ? '' : 'overlay-checkbox'}>
            <div className="question">
              <span className="label">Q3 </span>
              <span className="text">サービスをまた利用したいと思いますか？</span>
            </div>
            <div className="answer-option">
              {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
                <CheckboxCustom
                  options={optionQuestion2}
                  horizontal
                  onChange={(values: any): void => {
                    formSurvey.setFieldValue('reuse', values);
                    setDataSurveyCurrent({ ...dataSurveyCurrent, reuse: values });
                    setLocalStorage('data_survey_current', { ...dataSurveyCurrent, reuse: values });
                    setIsFullData(
                      (formSurvey.getFieldValue('quality') &&
                        formSurvey.getFieldValue('attitude_behavior') &&
                        formSurvey.getFieldValue('reuse') &&
                        formSurvey.getFieldValue('usually_use')) ||
                        (formSurvey.getFieldValue('quality') === 3 && formSurvey.getFieldValue('attitude_behavior')),
                    );
                  }}
                  value={getLocalStorage('data_survey_current')?.reuse}
                />
              ) : (
                <span className="answer-result">
                  {optionQuestion2[+dataCastMatchingById?.q3 - 1]?.label
                    ? `${optionQuestion2[+dataCastMatchingById?.q3 - 1]?.label}`
                    : ''}
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item name="usually_use" className={isActiveQues34 ? '' : 'overlay-checkbox'}>
            <div className="question">
              <span className="label">Q4 </span>
              <span className="text">定期的に利用したいと思いますか？</span>
            </div>
            <div className="answer-option">
              {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
                <CheckboxCustom
                  options={optionQuestion2}
                  horizontal
                  onChange={(values: any) => {
                    formSurvey.setFieldValue('usually_use', values);
                    setDataSurveyCurrent({ ...dataSurveyCurrent, usually_use: values });
                    setLocalStorage('data_survey_current', { ...dataSurveyCurrent, usually_use: values });
                    setIsFullData(
                      (formSurvey.getFieldValue('quality') &&
                        formSurvey.getFieldValue('attitude_behavior') &&
                        formSurvey.getFieldValue('reuse') &&
                        formSurvey.getFieldValue('usually_use')) ||
                        (formSurvey.getFieldValue('quality') === 3 && formSurvey.getFieldValue('attitude_behavior')),
                    );
                  }}
                  value={getLocalStorage('data_survey_current')?.usually_use}
                />
              ) : (
                <span className="answer-result">
                  {optionQuestion2[+dataCastMatchingById?.q4 - 1]?.label
                    ? `${optionQuestion2[+dataCastMatchingById?.q3 - 1]?.label}`
                    : ''}
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item name="opinion">
            <div className="question">
              <span className="label">Q5 </span>
              <span className="text">その他気になること、改善点や感想があればご記入ください。</span>
            </div>
            {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
              <textarea
                name="opinion"
                id=""
                className="textarea-global"
                placeholder="こちらのエリアに自由にご意見をご記入ください。"
                onChange={(e: any): void => {
                  formSurvey.setFieldValue('opinion', e.target.value);
                  setDataSurveyCurrent({ ...dataSurveyCurrent, opinion: e.target.value });
                  setLocalStorage('data_survey_current', { ...dataSurveyCurrent, opinion: e.target.value });
                }}
                value={getLocalStorage('data_survey_current')?.opinion}
              />
            ) : (
              <span className="answer-result">{dataCastMatchingById?.q5}</span>
            )}
          </Form.Item>
        </div>
        {dataCastMatchingById?.q1 === null && dataCastMatchingById?.q2 === null ? (
          <div className="btn-block">
            <Button className="btn" onClick={() => navigate(config.routes.customerQuestions)}>
              戻る
            </Button>
            <Button htmlType="submit" className={isFullData ? 'btn cr-allow' : 'btn not-allowed'}>
              {`送信 `}
            </Button>
          </div>
        ) : (
          <div className="btn-block">
            <Button className="btn" onClick={() => navigate(config.routes.customerQuestions)}>
              戻る
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default QuestionDetail;
