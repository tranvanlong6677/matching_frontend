import { Dispatch } from 'redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormInstance, Input, notification } from 'antd';

import { NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../../../../../redux/services/authSlice';
import { userApi } from '../../../../../api/userApi/userApi';
import { alertFail } from '../../../../../helper/common';
import config from '../../../../../config';

const NewPassword = () => {
  const dispatch: Dispatch = useDispatch();
  let [searchParams]: any = useSearchParams();
  const navigate: NavigateFunction = useNavigate();
  const [formNewPassword]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [isValidChange, setIsValidChange]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // GET DATA PARAMS
  const token: string | null = searchParams.get('key');

  // SUBMIT
  const onSubmit = async (values: any): Promise<void> => {
    if (values.password !== values.password_confirmation) {
      formNewPassword.setFields([
        {
          name: 'password_confirmation',
          errors: ['入力したパスワードが一致しません'],
        },
      ]);
    } else {
      try {
        const dataSubmit: any = {
          password: values.password,
          password_confirmation: values.password_confirmation,
          token: token,
        };
        const res: any = await userApi.setNewPassword(dataSubmit);
        if (res.status === 'success') {
          await dispatch(logout());
          navigate(config.routes.changPasswordSuccess);
          localStorage.clear();
        } else {
          alertFail(api, 'Fail');
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    }
  };

  // HANDLE CHANGE FIELD
  const handleFieldChange = (fieldChange: any, allFields: any): void => {
    let isValid: boolean =
      allFields[0]?.errors.length === 0 &&
      allFields[1]?.errors.length === 0 &&
      allFields[0]?.value !== '' &&
      allFields[1]?.value !== '' &&
      allFields[0]?.value === allFields[1]?.value;
    setIsValidChange(isValid);
  };

  return (
    <>
      {showPopup}
      <div className="block-password-new container-680">
        <Form onFinish={onSubmit} form={formNewPassword} onFieldsChange={handleFieldChange} autoComplete="off">
          <div className="content">
            <div className="menu-content">
              <div className="head-title">
                <h2 className="item-title">パスワードの変更</h2>
              </div>
              <div className="item-menu">
                <div className="term-change">
                  <h2 className="term-title-item">
                    メールアドレス認証いただきありがとうございました。
                    <br />
                    パスワードの再設定に進みます。
                  </h2>
                  <div className="block-change-input">
                    <Form.Item
                      name={'password'}
                      rules={[
                        { required: true, message: 'パスワードを入力してください' },
                        {
                          pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                          message: (
                            <>
                              半角英数字・記号で8文字以上、12文字以下でご登録ください。
                              <br />
                              （大文字、小文字、数字、記号 全てを含めてください）
                            </>
                          ),
                        },
                      ]}
                    >
                      <Input.Password
                        className="input-global"
                        placeholder="パスワード"
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                      />
                    </Form.Item>
                    <div className="check-item">
                      <input
                        type="checkbox"
                        name=""
                        className="show-password"
                        onChange={(): void => {
                          setPasswordVisible((prevState: boolean) => !prevState);
                        }}
                        checked={passwordVisible}
                      />
                      パスワードを表示
                    </div>
                  </div>
                  <p className="rule-item ts-1">
                    ※半角英数字・記号で8文字以上、12文字以下でご登録ください。
                    <br />
                    （大文字、小文字、数字記号1つ必須）
                  </p>
                  <div className="block-change-input">
                    <Form.Item
                      name={'password_confirmation'}
                      rules={[
                        {
                          message: '入力したパスワードが一致しません',
                          pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                        },
                      ]}
                    >
                      <Input.Password
                        className="input-global"
                        placeholder="確認用パスワード"
                        visibilityToggle={{
                          visible: passwordConfirmVisible,
                          onVisibleChange: setPasswordConfirmVisible,
                        }}
                      />
                    </Form.Item>

                    <div className="check-item">
                      <input
                        type="checkbox"
                        name=""
                        onChange={(): void => {
                          setPasswordConfirmVisible((prevState: boolean) => !prevState);
                        }}
                        checked={passwordConfirmVisible}
                      />
                      パスワードを表示
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block-btn-new-password">
            <button
              className={
                isValidChange ? 'btn btn-check btn-new-password ct-allow' : 'btn btn-check btn-new-password not-allowed'
              }
              type="submit"
              disabled={!isValidChange}
            >
              送信
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default NewPassword;
