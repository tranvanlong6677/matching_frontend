import { Form, FormInstance, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';

import config from '../../../../config';
import { sendEmailReg } from '../../../../redux/services/authSlice';
import { CAST_ROLE } from '../../../../utils/userRole';
interface RegEmailType {
  email: string;
}
const SendEmailReg = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formEmail]: [FormInstance] = Form.useForm();

  const onSubmit = async (values: RegEmailType): Promise<void> => {
    const submitData: any = {
      email: values.email,
      role: CAST_ROLE,
    };
    try {
      const res = await dispatch(sendEmailReg(submitData));
      if (res?.payload?.status === 'success') {
        navigate(config.routes.completeSendEmailSignUp);
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
          <span>新規会員登録</span>
        </div>
        <div className="description">
          <span>
            仮登録を行うためにメールアドレス認証を行います。
            <br /> メールアドレスを入力し、送信ボタンを押した後に
            <br />
            受信するメールより仮登録を行ってください。
          </span>
        </div>
        <Form form={formEmail} onFinish={onSubmit} className="form-input email-register-input" autoComplete="off">
          <Form.Item
            name={'email'}
            rules={[
              {
                required: true,
                message: 'メールアドレスを入力してください',
              },
            ]}
          >
            <Input type="text" className={`input-global`} placeholder="メールアドレス" />
          </Form.Item>

          <div className="block-input">
            <div>
              <button type="submit" className="btn cr-allow">
                送信
              </button>
            </div>
          </div>
        </Form>

        <div className="block-btn employee">
          <div className="title-txt">
            <h2>キャスト会員登録されている方</h2>
          </div>
          <button
            className="btn cr-allow"
            onClick={(): void => {
              navigate(config.routes.login);
            }}
          >
            ログイン
          </button>
        </div>
      </div>
    </>
  );
};

export default SendEmailReg;
