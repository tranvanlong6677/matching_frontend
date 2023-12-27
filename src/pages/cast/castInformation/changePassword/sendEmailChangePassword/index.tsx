import { Dispatch } from 'redux';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Form, Input, notification, Spin, FormInstance } from 'antd';

import { alertFail, alertSuccess } from '../../../../../helper/common';
import { sendEmailChangePassword } from '../../../../../redux/services/castSlice';
import config from '../../../../../config';

const SendEmailChangePassword = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formChangePassword]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();
  const inputRef: React.MutableRefObject<any> = useRef<any>(null);

  // HOOK STATE
  const [activeButton, setActivebutton]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // REDUCER
  const { loading } = useSelector((state: any) => state.castReducer);

  const onSubmit = async (values: any): Promise<void> => {
    if (activeButton) {
      try {
        const res: any = await dispatch(sendEmailChangePassword({ email: values.email }));
        if (res?.payload?.status === 'success') {
          formChangePassword.resetFields();
          setActivebutton(false);
          alertSuccess(api, 'Success');
          navigate(config.routes.castCompleteChangePassword);
        } else {
          formChangePassword.setFields([
            {
              name: 'email',
              errors: ['登録されてないメールアドレスです'],
            },
          ]);
          inputRef.current.focus();
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    }
  };

  // HANDLE ERROR
  const handleErrors = (): void => {
    inputRef.current.focus();
  };

  // HANDLE CHANGE FIELDS
  const handleFieldChange = (changedFields: any, _: any): void => {
    if (changedFields[0]?.value !== '' && changedFields[0]?.value !== undefined) {
      setActivebutton(true);
      formChangePassword.setFields([
        {
          name: 'email',
          errors: undefined,
        },
      ]);
    }
    if (changedFields[0]?.value === '' && changedFields[0]?.value !== undefined) {
      setActivebutton(false);
    }
  };

  return (
    <>
      {showPopup}
      <Spin spinning={loading}>
        <div className="block-password-change container-680">
          <Form
            autoComplete="off"
            onFinish={onSubmit}
            form={formChangePassword}
            onFinishFailed={handleErrors}
            onFieldsChange={handleFieldChange}
          >
            <div className="content">
              <div className="menu-content">
                <div className="head-title">
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
                        <Input className="form-item" placeholder="メールアドレス" ref={inputRef} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="block-change-password ">
              <button className="btn" onClick={(): void => navigate(config.routes.castInformation)} type="button">
                戻る
              </button>
              <button className={`btn${activeButton ? ' ct-allow' : ' not-allowed'}`} type="submit">
                送信
              </button>
            </div>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default SendEmailChangePassword;
