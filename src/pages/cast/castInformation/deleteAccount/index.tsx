import { Dispatch } from 'redux';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Checkbox, Form, FormInstance, notification } from 'antd';

import { alertFail, alertSuccess } from '../../../../helper/common';
import { deleteUser } from '../../../../redux/services/authSlice';
import config from '../../../../config';

const DeleteAccount = ({ isCustomer = false }: any) => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [formDelete]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [checkedDelete, setCheckedDelete]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // HANDLE SUBMIT
  const onSubmit = async (values: any): Promise<void> => {
    if (values.remember) {
      let res = await dispatch(deleteUser());
      if (res?.payload?.status === 'success') {
        alertSuccess(api, 'Success');
        if (!isCustomer) {
          navigate(config.routes.deleteCastAccountSuccess);
        } else {
          navigate(config.routes.deleteCustomerAccountSuccess);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } else {
        alertFail(api, 'Fail');
      }
    }
  };

  return (
    <>
      {showPopup}
      <div className="block-procedure container-680">
        <div className="menu-content" id="procedure-content">
          <Form onFinish={onSubmit} form={formDelete} autoComplete="off">
            <div className="item-des-procedure">
              <h2 className="title-delete-item">退会の手続き</h2>
              <div className="text-delete-account">
                <p>
                  退会に伴い、会員登録を解除いたします。
                  <br />
                  {isCustomer ? `登録の解除に伴い、お客様の個人情報、` : `登録の解除に伴い、キャスト会員様の個人情報、`}
                  <br />
                  利用履歴等、全ての情報を削除いたします。
                  <br />
                  これまで、ご利用いただきありがとうございました。
                  {isCustomer ? (
                    <>
                      <br />
                      またのご利用をお待ちしております。
                    </>
                  ) : (
                    <></>
                  )}
                </p>
              </div>
              <div className="check-term">
                <Form.Item name="remember" valuePropName={'checked'}>
                  <Checkbox
                    onChange={(e: CheckboxChangeEvent): void => {
                      setCheckedDelete(e.target.checked);
                    }}
                  >
                    上記を確認し、同意しました
                  </Checkbox>
                </Form.Item>
              </div>
            </div>

            <div className="block-btn-produce">
              {!isCustomer && (
                <button className="btn" onClick={(): void => navigate(config.routes.castInformation)} type="button">
                  戻る
                </button>
              )}

              <button
                className={`${isCustomer ? 'btn isCustomerDelete' : 'btn '}${!checkedDelete ? ' not-allowed' : ''}`}
                id={`${checkedDelete ? 'btn-danger' : ''}`}
                type="submit"
              >
                退会する
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;
