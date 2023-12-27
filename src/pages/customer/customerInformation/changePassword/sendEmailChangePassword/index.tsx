import { Dispatch } from 'redux';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormInstance, Input, notification, Spin } from 'antd';

import { sendEmailChangePassword } from '../../../../../redux/services/castSlice';
import { alertFail, alertSuccess } from '../../../../../helper/common';
import config from '../../../../../config';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const CustomerSendEmailChangePassword = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const refPassword: any = useRef<any>(null);
  const [formChangePassword]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [activeButton, setActiveButton]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  const { loading } = useSelector((state: any) => state.castReducer);

  const onSubmit = async (values: any): Promise<void> => {
    if (activeButton) {
      try {
        const res: any = await dispatch(sendEmailChangePassword({ email: values.email }));
        if (res?.payload?.status === 'success') {
          setActiveButton(false);
          formChangePassword.resetFields();
          alertSuccess(api, 'Success');
          navigate(config.routes.customerCompleteChangePassword);
        } else {
          formChangePassword.setFields([
            {
              name: 'email',
              errors: ['登録されてないメールアドレスです'],
            },
          ]);

          //FOCUS INPUT
          refPassword.current.focus();
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    }
  };

  const handleErrors = (): void => {
    refPassword.current.focus();
  };

  const handleFieldChange = (changedFields: any, _: any): void => {
    if (changedFields[0]?.value !== '' && changedFields[0]?.value !== undefined) {
      setActiveButton(true);
      formChangePassword.setFields([
        {
          name: 'email',
          errors: undefined,
        },
      ]);
    }
    if (changedFields[0]?.value === '' && changedFields[0]?.value !== undefined) {
      setActiveButton(false);
    }
  };

  return (
    <div className="setting-password-container container-680">
      {showPopup}
      <Spin spinning={loading}>
        <div className="block-password-change ">
          <Form
            onFinish={onSubmit}
            form={formChangePassword}
            onFinishFailed={handleErrors}
            onFieldsChange={handleFieldChange}
            autoComplete="off"
          >
            <div className="content">
              <div className="menu-content">
                <div className="head-title bottom-title-customer">
                  <h2 className="item-title">パスワードの変更</h2>
                </div>
                <div className="item-menu">
                  <div className="term-change">
                    <div className="item-des">
                      <p className="text-term-change">
                        パスワード再設定のためにメールアドレス認証を行います。
                        <br />
                        メールアドレスを入力し、送信ボタンを押した後に
                        <br />
                        受信するメールよりパスワードの再設定を行ってください。
                      </p>
                    </div>
                    <div className="input-group-term">
                      <Form.Item name={'email'}>
                        <Input className="form-item" placeholder="メールアドレス" ref={refPassword} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="block-change-password d-flex-bw">
              <button className={`btn${activeButton ? ' cr-allow' : ' not-allowed'}`} type="submit">
                送信
              </button>
            </div>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default CustomerSendEmailChangePassword;
