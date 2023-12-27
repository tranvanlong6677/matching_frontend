import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Form, FormInstance, Input, notification, Space } from 'antd';

import { alertFail, alertSuccess, setLocalStorage } from '../../../helper/common';
import adminLogo from '../../../assets/images/mockup/logoAdmin.png';
import { login } from '../../../redux/services/authSlice';
import config from '../../../config';

const CAST_ROLE: number = 1;

const inputStyles: { height: string } = {
  height: '40px',
};

const AdminLogin = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [loginForm]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  const setError = () => {
    loginForm.setFields([
      {
        name: 'email',
        errors: [''],
      },
      {
        name: 'password',
        errors: ['パスワードが間違いました。'],
      },
    ]);
  };

  // HANDLE SUBMIT
  const onFinish = async (values: any): Promise<void> => {
    const dataSubmit: any = {
      email: values.email,
      password: values.password,
      role: CAST_ROLE,
    };

    try {
      const res = await dispatch(login(dataSubmit));
      if (res?.payload?.status === 'success') {
        alertSuccess(api, 'Success');
        setLocalStorage('user', res?.payload?.data?.user);
        setTimeout((): void => {
          if (res?.payload?.data?.access_token) {
            navigate(config.routes.customerList);
          }
        }, 500);
      } else {
        setError();
      }
    } catch (error) {
      alertFail(api, 'Fail');
    }
  };

  return (
    <div className="admin-login-wrapper" id="admin-login">
      {showPopup}
      <div className="admin-login-inner">
        <div className="admin-login-container">
          <div className="admin-login-logo">
            <img src={adminLogo} alt={'Error'} />
          </div>
          <div className="admin-login-form">
            <h1>管理画面</h1>
            <Form
              name="basic"
              form={loginForm}
              autoComplete="off"
              onFinish={onFinish}
              style={{ width: '100%' }}
              initialValues={{ remember: true }}
            >
              <Space direction={'vertical'} style={{ width: '100%' }} size={30}>
                <div className="form-item-group">
                  <label>メール: </label>
                  <Form.Item
                    name="email"
                    style={{ width: '100%' }}
                    rules={[{ required: true, message: 'メールを入力してください。' }]}
                  >
                    <Input className={'username'} style={inputStyles} />
                  </Form.Item>
                </div>

                <div className="form-item-group">
                  <label>パスワード: </label>
                  <Form.Item
                    name="password"
                    style={{ width: '100%' }}
                    rules={[{ required: true, message: 'パスワードを入力してください。' }]}
                  >
                    <Input.Password style={inputStyles} />
                  </Form.Item>
                </div>

                <div className="admin-login-btn-group">
                  <Button
                    type="primary"
                    size={'large'}
                    htmlType="submit"
                    style={{
                      width: '200px',
                      height: '50px',
                      fontSize: '20px ',
                    }}
                  >
                    ログイン
                  </Button>
                </div>
              </Space>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
