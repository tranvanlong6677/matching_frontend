/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Form, FormInstance, Input, notification } from 'antd';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import ErrorValidate from '../../../../components/validate/errorValidate';
import { alertSuccess, setLocalStorage } from '../../../../helper/common';
import image from '../../../../assets/images/index';
import { login } from '../../../../redux/services/authSlice';
import '../../../../assets/styles/style.scss';
import config from '../../../../config';
import { USER_ROLE } from '../../../../utils/userRole';

const CAST_ROLE: number = 3;

const Login = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [loginForm]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();
  const location = useLocation();

  // HOOK STATE
  const [passwordVisible, setPasswordVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  const onSubmit = async (values: any): Promise<void> => {
    const dataSubmit: any = {
      email: values.email,
      password: values.password,
      role: CAST_ROLE,
    };

    try {
      const res = await dispatch(login(dataSubmit));
      if (res?.payload?.status === 'success') {
        if (location.state) {
          alertSuccess(api, 'Success');
          setLocalStorage('user', res?.payload?.data?.user);
          navigate(`${config.routes.newPassword}${location.state.search}`);
        } else {
          alertSuccess(api, 'Success');
          setLocalStorage('user', res?.payload?.data?.user);
          setTimeout((): void => {
            if (res?.payload?.data?.user?.role === CAST_ROLE) {
              navigate(config.routes.castDashboard);
            }
            if (res?.payload?.data?.user?.role === USER_ROLE) {
              navigate(config.routes.customerDashboard);
            }
          }, 500);
        }
      } else {
        setShowErrorMessage(true);
        loginForm.setFields([
          {
            name: 'email',
            errors: [''],
          },
          {
            name: 'password',
            errors: [''],
          },
        ]);
      }
    } catch (error) {}
  };
  const checkLoginData = () => {
    if (!loginForm.getFieldValue('email') || !loginForm.getFieldValue('password')) {
      setShowErrorMessage(true);
    }
  };
  return (
    <>
      {showPopup}
      <section className="header-login">
        <img src={image.logoLoginNew} alt="Error" />
      </section>

      <div className="form-login">
        <Form onFinish={onSubmit} form={loginForm}>
          <div className="form-group">
            <Form.Item
              name={'email'}
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Input className="input-global" type="text" placeholder="メールアドレス" />
            </Form.Item>
          </div>
          <div className="form-group-bottom">
            <Form.Item
              name={'password'}
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Input.Password
                type="text"
                placeholder="パスワード"
                className="input-global"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                onChange={(): any => {
                  if (!loginForm.getFieldValue('email') || !loginForm.getFieldValue('password')) {
                    setShowErrorMessage(true);
                  } else {
                    setShowErrorMessage(false);
                  }
                }}
              />
            </Form.Item>
          </div>
          <div className={`form-group-checkbox-login ${showErrorMessage ? 'mb-0' : ''}`}>
            <div className="checkbox-login-element">
              <input className="" type="checkbox" />
              <span>次回から自動的にログイン</span>
            </div>
            <div className="checkbox-login-element">
              <input
                className=""
                type="checkbox"
                checked={passwordVisible}
                onChange={(): void => {
                  setPasswordVisible((prevState: boolean) => !prevState);
                }}
              />
              <span>パスワードを表示</span>
            </div>
          </div>
          {showErrorMessage || false ? (
            <div className="block-error">
              <div className="error-validate">
                <ErrorValidate errorText="メールアドレス・パスワードに誤りがあるか、登録されていません。" />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="btn-login-container">
            <button className="btn cr-allow btn-login" onClick={() => checkLoginData()}>
              キャストログイン
            </button>
          </div>
        </Form>
        <div className="forgot">
          <span className="forgot-email">
            登録したメールアドレスを忘れた方は
            <a href="">コチラ</a>
          </span>
          <span className="forgot-password">
            パスワードを忘れた方は
            <a href="">コチラ</a>
          </span>
        </div>
      </div>
      <div className="have-account">
        <h1>キャスト登録されていない方</h1>
      </div>
      <div className="btn-login-container-bottom">
        <button
          className=" btn-register-member"
          onClick={(): void => {
            navigate(config.routes.sendMailToRegister);
          }}
        >
          新規キャスト登録
        </button>
      </div>
    </>
  );
};

export default Login;
