import Icon from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FormInstance, Input, Select, Tooltip, notification } from 'antd';

import { alertFail, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import StatusBarCustomer from '../../../../components/status/statusbarCustomer';
import imgTooltip from '../../../../assets/images/mockup/tooltipCvvImage.png';
import ErrorValidate from '../../../../components/validate/errorValidate';
import image from '../../../../assets/images/index';
import config from '../../../../config';

const monthItems = [
  {
    label: '01',
    value: '01',
  },
  {
    label: '02',
    value: '02',
  },
  {
    label: '03',
    value: '03',
  },

  {
    label: '04',
    value: '04',
  },
  {
    label: '05',
    value: '05',
  },
  {
    label: '06',
    value: '06',
  },
  {
    label: '07',
    value: '07',
  },
  {
    label: '08',
    value: '08',
  },
  {
    label: '09',
    value: '09',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '11',
    value: '11',
  },
  {
    label: '12',
    value: '12',
  },
];

const CustomerSignUpBank = ({ isChangeCredit = false }: any) => {
  const navigate: NavigateFunction = useNavigate();
  const [formBankCustomer]: [FormInstance] = Form.useForm();
  const [api, showPopup]: any = notification.useNotification();

  const { pathname }: any = useLocation();
  // HOOK STATE
  const [inputCvv, setInputCvv]: [string, React.Dispatch<any>] = useState<any>('');
  const [selectYear, setSelectYear]: [any, React.Dispatch<any>] = useState<any>('');
  const [selectMonth, setSelectMonth]: [any, React.Dispatch<any>] = useState<any>('');
  const [inputYearData, setInputYearData]: [string, React.Dispatch<any>] = useState<any>('');
  const [inputMonthData, setInputMonthData]: [string, React.Dispatch<any>] = useState<any>('');
  const [isDisplayError, setIsDisplayError]: [any, React.Dispatch<any>] = useState({
    month: false,
    year: false,
    cvv: false,
  });
  const [statusCheckFieldEmpty, setStatusCheckFieldEmpty]: any = useState(false);

  // GET DATA LOCAL
  const editStatus = getLocalStorage('usredt');
  const userBankData = getLocalStorage('usrbdt');
  const isEditBankOnly = getLocalStorage('isEditBankOnly');

  // GET MONTH AND YEAR
  const monthNow: number = new Date().getMonth() + 1;
  const yearNow: number = new Date().getFullYear();

  // HOOK EFFECT
  useEffect((): void => {
    if (userBankData !== null) {
      const dateConvert: string[] = userBankData?.expired_date?.split('-');
      const tmpData: any = {
        card_type: userBankData?.card_type,
        card_number: userBankData?.card_number,
        card_holder: userBankData?.card_holder,
        security_code: userBankData?.security_code,
        year: dateConvert !== undefined && dateConvert[1],
        month: dateConvert !== undefined && dateConvert[0],
      };

      // SET STATE
      setInputCvv(tmpData?.security_code);
      setInputMonthData(tmpData?.month);
      setInputYearData(tmpData?.year);

      // SET VALUE FORM
      setStatusCheckFieldEmpty(true);
      formBankCustomer.setFieldsValue(tmpData);
    }

    if (localStorage.getItem('expired_date_format')) {
      setLocalStorage('isEditBankOnly', true);
      localStorage.removeItem('expired_date_format');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLE SUBMIT
  const onSubmit = (values: any): void => {
    if (statusCheckFieldEmpty) {
      const selectedMonth: number = parseInt(values.month, 10);
      const selectedYear: number = parseInt(values.year, 10);
      if (
        (inputCvv?.length === 3 &&
          (selectedYear > yearNow || (selectedYear === yearNow && selectedMonth > monthNow))) ||
        Number(inputYearData) > yearNow ||
        (Number(inputYearData) === yearNow && Number(inputMonthData) > monthNow)
      ) {
        const userBankData: any = {
          card_type: 1,
          card_number: values.card_number,
          card_holder: values.card_holder,
          security_code: values.security_code,
          expired_date: `${values.month}-${values.year}`,
        };

        setLocalStorage('usrbdt', userBankData);

        if (editStatus) {
          if (isEditBankOnly) {
            setLocalStorage('expired_date_format', `${values.year}-${values.month}`);
            navigate(config.routes.confirmChangeInfoCreditCardEdit);
            localStorage.removeItem('isEditBankOnly');
          } else {
            navigate(config.routes.confirmRegisterCustomerEdit);
          }
        } else {
          navigate(config.routes.confirmRegisterCustomer);
        }
      } else {
        setIsDisplayError({ month: true, year: true, cvv: false });
        if (inputCvv?.length < 3) {
          formBankCustomer.setFields([
            {
              name: 'security_code',
              errors: [''],
            },
          ]);
        } else {
          formBankCustomer.setFields([
            {
              name: 'month',
              errors: [''],
            },
          ]);

          formBankCustomer.setFields([
            {
              name: 'year',
              errors: [''],
            },
          ]);
        }
        setIsDisplayError((prevState: any) => ({
          ...prevState,
          month: selectedMonth <= monthNow,
          year: selectedYear <= yearNow,
          cvv: values.security_code === '',
        }));

        alertFail(api, 'Fail');
      }
    }
  };

  // HANDLE DATE
  const date: number = new Date().getFullYear();

  useEffect((): void => {
    let year: any[] = [];
    for (let i: number = date; i < 2100; i++) {
      year.push({ value: i, label: i });
    }
    setSelectMonth(monthItems);
    setSelectYear(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLE MAX LENGTH
  const handleMaxLength = (object: any): void => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength);
    }
  };

  const handleFieldChange = (_: any, allFields: any) => {
    const checkEmpty = allFields?.find((field: any) => field.value === undefined || field.value === '');
    const inputCvv = allFields?.find((field: any) => field.name[0] === 'security_code');

    if (checkEmpty) {
      setStatusCheckFieldEmpty(false);
    }

    if (!checkEmpty && inputCvv?.value?.toString()?.length < 3) {
      setStatusCheckFieldEmpty(false);
    }

    if (!checkEmpty && inputCvv?.value?.toString()?.length === 3) {
      setStatusCheckFieldEmpty(true);
    }
  };

  return (
    <div className="signup-credit-container container-680">
      {showPopup}
      {editStatus || pathname === 'user/mypage/detail/settings/revise/credit' ? (
        <div className="title information-input-title">
          <h2 className="head-title">{isChangeCredit ? 'クレジットカードの変更' : '会員情報の変更'}</h2>
        </div>
      ) : (
        <>
          <StatusBarCustomer page1={true} page2={true} />
        </>
      )}
      <div className="logo-container">
        <img src={image.iconLogoBank} alt="Error" />
      </div>
      <div className="form-credit-user">
        <div className="head">
          <span>*必須項目</span>
        </div>
        <Form
          autoComplete="off"
          onFinish={onSubmit}
          name="control-hooks"
          className="form-group"
          form={formBankCustomer}
          onFieldsChange={handleFieldChange}
        >
          <Form.Item
            name="card_number"
            rules={[
              {
                required: true,
                message: (
                  <>
                    カード番号を入力してください <br />
                    カード番号が無効です
                  </>
                ),
              },
            ]}
          >
            <Input
              type="number"
              className="input-global"
              addonBefore={<>*</>}
              placeholder="カード番号入力"
              allowClear={true}
              onWheel={(event) => event.currentTarget.blur()}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="card_holder"
            rules={[
              {
                required: true,
                message: '名義人を入力してください',
              },
            ]}
          >
            <Input className="input-global" placeholder="名義人" allowClear={true} addonBefore={<>*</>} />
          </Form.Item>
          <div className="expiration-date">
            <span className="title">
              <span className="star">*</span>
              <span>有効期限</span>
            </span>
            <div className="form-expiration-date">
              <Form.Item
                className="form-month"
                name="month"
                rules={[
                  {
                    required: true,
                    message: '',
                  },
                ]}
              >
                <Select
                  placeholder="01"
                  options={selectMonth}
                  className="select-global month"
                  onChange={(value) => setInputMonthData(value)}
                  suffixIcon={<Icon component={() => <img src={image.iconArrowSelectTag} alt="Error" />} />}
                />
              </Form.Item>
              <label className="month-label">月</label>

              <Form.Item
                className="form-year"
                name="year"
                label=""
                rules={[
                  {
                    required: true,
                    message: '',
                  },
                ]}
              >
                <Select
                  placeholder="2023"
                  options={selectYear}
                  className="select-global year"
                  onChange={(value) => setInputYearData(value)}
                  suffixIcon={<Icon component={() => <img src={image.iconArrowSelectTag} alt="" />} />}
                />
              </Form.Item>
              <label className="year-label">年</label>
            </div>
          </div>
          {isDisplayError.month || isDisplayError.year ? (
            <ErrorValidate
              errorText={
                !inputMonthData || !inputYearData
                  ? '有効期限を入力してください'
                  : parseInt(inputYearData, 10) <= yearNow && parseInt(inputMonthData, 10) <= monthNow
                  ? 'あなたのカードの期限はもう切れました'
                  : ''
              }
            />
          ) : null}

          {/*-----------------------*/}
          <div
            className={
              (isDisplayError.cvv && inputCvv === '') || (inputCvv?.length !== 3 && inputCvv?.length > 0)
                ? 'input-global error-cvv'
                : 'input-global'
            }
          >
            <span className="label-cvv">
              <sup className="required">*</sup>セキュリティコード
            </span>
            <Form.Item className="cvv" name="security_code" label="">
              <Input
                id="CVV"
                type="number"
                maxLength={3}
                value={inputCvv}
                placeholder="CVV"
                className="input-cvv"
                onInput={handleMaxLength}
                onChange={(e: React.ChangeEvent<any>): void => {
                  setInputCvv(e.target.value);
                }}
                onWheel={(event) => event.currentTarget.blur()}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <Tooltip
              color="#fff"
              placement="topRight"
              arrow={{ pointAtCenter: true }}
              overlayInnerStyle={{ width: 'fit-content' }}
              title={
                <div className="content-tooltip-wrapper">
                  <img src={imgTooltip} alt="" />
                </div>
              }
              getPopupContainer={(node: any) => {
                return node?.parentNode?.parentNode?.parentNode;
              }}
            >
              <img src={image.iconCvv} alt="" />
            </Tooltip>
          </div>

          {isDisplayError.cvv && inputCvv === '' ? (
            <ErrorValidate errorText="ゼキュリティコードを入力してください" />
          ) : null}

          {inputCvv?.length > 0 && inputCvv?.length < 3 ? (
            <ErrorValidate errorText="正しくセキュリティコードを入力してください" />
          ) : null}

          <div className="button-block">
            <Button
              className="btn"
              onClick={(): void => {
                if (editStatus) {
                  if (isEditBankOnly) {
                    localStorage.removeItem('isEditBankOnly');
                    navigate(config.routes.customerInformation);
                  } else {
                    navigate(config.routes.editCustomer);
                  }
                } else {
                  navigate(config.routes.signupCustomer);
                }
              }}
            >
              戻る
            </Button>

            <Button
              htmlType={statusCheckFieldEmpty ? 'submit' : 'button'}
              className={`btn${statusCheckFieldEmpty ? ' cr-allow' : ' not-allowed'}`}
              onClick={(): void => {
                setIsDisplayError({ month: true, year: true, cvv: true });
              }}
            >
              次へ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CustomerSignUpBank;
