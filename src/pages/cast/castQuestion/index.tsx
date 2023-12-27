import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { castApi } from '../../../api';
import image from '../../../assets/images/index';
import config from '../../../config';

const dataModalDefault: any = [
  {
    typeRequest: '予約についてのお問い合わせ',
  },
  {
    typeRequest: '確定済の予約についてのお問い合わせ',
  },
  {
    typeRequest: 'サービス全般についてのお問い合わせ',
  },
  {
    typeRequest: '業務委託費、振込口座に関するお問い合わせ',
  },
  {
    typeRequest: '上記以外の問い合わせ',
  },
];

export default function CastQuestion(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [formContact]: [FormInstance] = Form.useForm();
  const inputContentRef: React.MutableRefObject<any> = useRef<any>();

  // HOOK STATE
  const [dataModal] = useState(dataModalDefault);
  const [showService, setShowService]: [boolean, React.Dispatch<any>] = useState(false);

  // HANDLE SUMBIT
  const onSubmit = async (values: any): Promise<void> => {
    let res: any = await castApi.castContact(values);
    if (res.status === 'success') {
      formContact.setFieldValue('type_request', '');
      formContact.setFieldValue('content', '');
      navigate(config.routes.castQuestionSuccess);
    }
  };

  // HANDLE FORM ERROR
  const handleFormError = ({ values, _, __ }: any): void => {
    if (values?.content === undefined) {
      inputContentRef?.current?.focus();
    }
  };

  return (
    <>
      <Modal
        footer={false}
        open={showService}
        onCancel={(): void => {
          setShowService(false);
        }}
        title={
          <div>
            <h2 className="head-modal-title">お問合せを選択してください。</h2>
          </div>
        }
        closeIcon={
          <>
            <img src={image.iconClose} alt="Error" />
          </>
        }
      >
        {/* ADD DATA MODAL*/}
        {dataModal &&
          dataModal?.length > 0 &&
          dataModal?.map((item: any, index: number) => {
            return (
              <p
                key={index}
                onClick={(): void => {
                  formContact.setFieldValue('type_request', item.typeRequest);
                  formContact.setFields([
                    {
                      name: 'type_request',
                      errors: undefined,
                    },
                  ]);
                  setShowService(false);
                }}
              >
                {item.typeRequest}
              </p>
            );
          })}
      </Modal>
      <div className="block-question container-680">
        <div className="content">
          <Form autoComplete="off" form={formContact} onFinish={onSubmit} onFinishFailed={handleFormError}>
            <div className="menu-content">
              <div className="head-title">
                <div className="icon">
                  <img src={image.iconQuestion} alt="" />
                </div>
                <h2 className="item-title-question">よくあるご質問</h2>
              </div>
              <div className="question-action">
                <div className="question-action-item">
                  困ったことがあれば、
                  <br />
                  こちらの「よくあるご質問」をご覧ください。
                  <br />
                  キャストに関する質問と回答をご紹介しています。
                </div>
                <button type="button" className="btn ct-allow">
                  <a href="http://www.epais.co.jp/cast/faq" target="blank" rel="noopener">
                    よくあるご質問
                  </a>
                </button>
              </div>
              <div className="head-title">
                <div className="icon">
                  <img src={image.iconPhone} width="51px" alt="" />
                </div>
                <h2 className="item-title-question">お電話によるお問い合わせ</h2>
              </div>
              <div className="phone-item">
                <span>
                  お問い合わせの際は番号をよくお確かめの上おかけください。
                  <br />
                  緊急時以外はメールでのお問い合わせをお願いいたします。
                </span>
                <span>TEL : 03-XXXX-XXXX</span>
                <span className="detail-tel">【 受付時間 】 10:00〜17:00（土日祝は休み）</span>
              </div>
              <div className="head-title">
                <div className="icon">
                  <img src={image.iconMail} width="51px" alt="" />
                </div>
                <h2 className="item-title-question">メールによるお問い合わせ</h2>
              </div>
              <div className="form-response">
                <div
                  className="form-group form-group-bottom"
                  onClick={(): void => {
                    setShowService(true);
                  }}
                >
                  <Form.Item
                    name={'type_request'}
                    rules={[{ required: true, message: '可能提供サービスを入力してください' }]}
                  >
                    <Input
                      readOnly
                      type="text"
                      maxLength={0}
                      placeholder="お問い合わせ種別"
                      className="input-global service"
                      suffix={<CaretDownOutlined className="icon-dropdown" />}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name={'content'}
                  rules={[
                    {
                      required: true,
                      message: 'ここにデータを入力してください',
                    },
                  ]}
                >
                  <Input.TextArea
                    id="question-form"
                    className="form-item"
                    ref={inputContentRef}
                    placeholder="内容をご記入ください"
                  />
                </Form.Item>
              </div>
              <div className="block-question-btn">
                <Form.Item>
                  <Button className="btn" onClick={() => navigate(config.routes.castDashboard)}>
                    戻る
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button className="btn ct-allow" htmlType="submit">
                    {`送信 `}
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
