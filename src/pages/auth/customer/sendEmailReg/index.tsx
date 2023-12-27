import { Dispatch } from 'redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormInstance, Input } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { sendEmailReg } from '../../../../redux/services/authSlice';
import config from '../../../../config';

interface RegEmailType {
  email: string;
}

const SendEmailRegCustomer = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [isActiveBtn, setIsActiveBtn]: [boolean, React.Dispatch<any>] = useState(false);
  const [formEmail]: [FormInstance] = Form.useForm();

  // HANDLE SUBMIT
  const onSubmit = async (values: RegEmailType): Promise<void> => {
    const submitData: any = {
      email: values.email,
      role: 2,
    };
    try {
      const res = await dispatch(sendEmailReg(submitData));
      if (res?.payload?.status === 'success') {
        navigate(config.routes.completeSendEmailSignUpCustomer);
      }
      if (res?.payload?.status === 'exist') {
        formEmail.setFields([
          {
            name: 'email',
            errors: ['登録済みのメールアドレスです'],
          },
        ]);
      } else {
        formEmail.setFields([
          {
            name: 'email',
            errors: ['メールアドレスを入力してください'],
          },
        ]);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="register-container container-630">
        <div className="title">
          <h1 className="register-title">新規会員登録</h1>
        </div>
        <div className="description">
          <span>
            仮登録を行うためにメールアドレス認証を行います。
            <br />
            メールアドレスを入力し、送信ボタンを押した後に <br /> 受信するメールより仮登録を行ってください。
          </span>
        </div>
        <Form form={formEmail} onFinish={onSubmit} className="email-register-input" autoComplete="off">
          <Form.Item
            name={'email'}
            rules={[
              {
                required: true,
                message: 'メールアドレスを入力してください',
              },
            ]}
          >
            <Input
              type="text"
              className={`input-global`}
              autoComplete="off"
              placeholder="メールアドレス"
              onChange={() => {
                if (formEmail.getFieldValue('email')) {
                  setIsActiveBtn(true);
                } else {
                  setIsActiveBtn(false);
                }
              }}
            />
          </Form.Item>

          <div className="block-input">
            <div>
              <button type="submit" className={isActiveBtn ? 'btn send ' : 'btn send-disabled'} disabled={!isActiveBtn}>
                送信
              </button>
            </div>
          </div>
        </Form>

        <div className="block-btn employee">
          <div className="title-txt">
            <h2>会員登録されているお客様</h2>
          </div>
          <button
            className="btn cr-allow"
            onClick={(): void => {
              navigate(config.routes.loginCustomer);
            }}
          >
            ログイン
          </button>
        </div>
      </div>
    </>
  );
};

export default SendEmailRegCustomer;
