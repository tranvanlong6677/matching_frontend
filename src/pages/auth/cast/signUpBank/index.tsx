import { Dispatch } from 'redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormInstance, Input, Select, Spin } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { getBankBranches, searchBank } from '../../../../redux/services/bankSlice';
import { getLocalStorage, setLocalStorage } from '../../../../helper/common';
import ErrorValidate from '../../../../components/validate/errorValidate';
import { optionBankMoney } from '../../../../utils/accountTypeItems';
import CheckboxCustom from '../../../../components/checkboxCustom';
import StatusBar from '../../../../components/status/statusBar';
import useDebounce from '../../../../hooks/useDebounce';
import mockupBankBranch from './mockupBankBranch.json';
import image from '../../../../assets/images/index';
import mockupBank from './mockupBank.json';
import config from '../../../../config';

const dropDownStyles: any = {
  left: 0,
  top: '100%',
};

const SignUpBank = () => {
  const dispatch: Dispatch = useDispatch();
  const editOnlyBank = getLocalStorage('usredb');
  const navigate: NavigateFunction = useNavigate();
  const [formUserBank]: [FormInstance] = Form.useForm();

  // HOOK STATE
  const [saveData, setSaveData]: [any, React.Dispatch<any>] = useState<any>([]);
  const [loading, setLoading]: [boolean, React.Dispatch<any>] = useState(false);
  const [showErrorAccount, setShowErrorAccount]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [statusCheckFieldEmpty, setStatusCheckFieldEmpty] = useState(false);

  // REDUCER
  const { banks, branches } = useSelector((state: any) => state.bankReducer);

  // GET DATA LOCAL
  const editStatus = getLocalStorage('usredt');
  const userBankData = getLocalStorage('usrbdt');

  const [searchResult, setSearchResult]: [any, React.Dispatch<any>] = useState([]);
  const [dataInputTypingBank, setDataInputTypingBank]: [string, React.Dispatch<any>] = useState('');
  const [dataInputTypingBranch, setDataInputTypingBranch]: [string, React.Dispatch<any>] = useState('');

  const [bankBranchDisplay, setBankBranchDisplay]: [any, React.Dispatch<any>] = useState<any>([]);
  const [bankBranchDataUser, setBankBranchDataUser] = useState({ value: '', id: '', name: '', bankId: '' });

  const [valueInputBank, setValueInputBank]: [string, React.Dispatch<any>] = useState('');
  const [valueInputBranch, setValueInputBranch]: [string, React.Dispatch<any>] = useState('');
  const [isFocusBank, setIsFocusBank]: [boolean, React.Dispatch<any>] = useState(false);

  const debouncedValue = useDebounce(dataInputTypingBank, 500);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleDropdownVisibleChange = (visible: boolean): void => {
    if (visible) {
      setValueInputBank('');
      setValueInputBranch('');
    }
  };

  // HOOK EFFECT

  useEffect((): void => {
    if (userBankData !== null) {
      setIsFormValid(true);
      const fetchDataBranches = async (): Promise<void> => {
        const response = await dispatch(searchBank(userBankData?.bank_name));
        if (response?.payload?.status === 'success') {
          setTimeout(async (): Promise<void> => {
            await dispatch(getBankBranches(response?.payload?.data?.data?.[0]?.code));
          }, 1000);
        }
      };
      fetchDataBranches();

      const tmpData: any = {
        bank_name: userBankData?.bank_name,
        store_name: userBankData?.store_name,
        account_type: userBankData?.account_type,
        account_name: userBankData?.account_name,
        account_number: userBankData?.account_number,
      };

      setSaveData(userBankData?.account_type);
      formUserBank.setFieldsValue(tmpData);
      const tmpBranchData: any = mockupBankBranch?.filter(
        (item: any): boolean =>
          item.bankId === mockupBank?.find((itemBank: any): boolean => itemBank?.value === userBankData?.bank_name)?.id,
      );
      setBankBranchDisplay(tmpBranchData);
      setStatusCheckFieldEmpty(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }
    const fetchApi = async (): Promise<void> => {
      try {
        setLoading(true);
        await dispatch(searchBank(debouncedValue));
        setLoading(false);
      } catch (e) {}
    };

    fetchApi();
  }, [debouncedValue]);

  // HANDLE SUBMIT
  const onSubmit = (values: any): void => {
    const userBankData = {
      ...values,
      account_type: saveData,
    };
    setLocalStorage('usrbdt', userBankData);
    if (editOnlyBank) {
      navigate(config.routes.castBankDetail);
    } else {
      if (editStatus) {
        navigate(config.routes.confirmRegisterEdit);
      } else {
        navigate(config.routes.confirmRegister);
      }
    }
  };
  const fetchBranchBank = (bankId: any): void => {
    let bankBranchFilter: any = mockupBankBranch?.filter((item: any): boolean => +item?.bankId === +bankId);
    setBankBranchDisplay(bankBranchFilter);
  };
  const handleChange = (value: any): void => {
    setShowErrorAccount(false);
    setSaveData(value);
  };
  const handleValueChange = (changedValues: any, allValues: any) => {
    const isNullish = Object.values(allValues).every((value) => {
      if (value !== undefined) {
        return true;
      }
      return false;
    });
    setIsFormValid(isNullish);
  };
  // HANDLE ERROR
  const handleError = ({ _, errorFields, __ }: any): void => {
    const filterAccountError = errorFields?.filter((item: any): boolean => item.name[0] === 'account_type');
    if (filterAccountError.length !== 0) {
      setShowErrorAccount(true);
      formUserBank.setFields([
        {
          name: 'account_type',
          errors: [''],
        },
      ]);
    } else {
      setShowErrorAccount(false);
      formUserBank.setFields([
        {
          name: 'account_type',
          errors: undefined,
        },
      ]);
    }
  };

  // HANDLE CHANGE BANK
  const handleOnChangeBank = async (value: any, option: any): Promise<void> => {
    try {
      await dispatch(getBankBranches(option?.code));
    } catch (e) {}
    formUserBank.setFieldValue('store_name', undefined);
    setValueInputBank(value);
    setIsFocusBank(false);
    setDataInputTypingBank('');
    fetchBranchBank(option?.id);
  };

  const handleOnChangeBranch = (value: any, option: any): void => {
    setValueInputBranch(value);
    setBankBranchDataUser(option);
    setDataInputTypingBranch('');
  };

  const handleFieldsChange = (values: any, allFields: any) => {
    const checkEmpty = allFields?.find(
      (field: any) => field.value === undefined || field.value === '' || field.value === null,
    );
    if (checkEmpty) {
      setStatusCheckFieldEmpty(false);
    }

    if (!checkEmpty) {
      setStatusCheckFieldEmpty(true);
    }
  };

  return (
    <div className="bank-container container-680">
      {editStatus || editOnlyBank ? (
        <div className="head-title">
          <h2>{`${editOnlyBank ? '振込先情報の変更' : '会員情報の変更'}`}</h2>
        </div>
      ) : (
        <StatusBar page2={true} page1={true} />
      )}
      <div className="bank-form">
        <div className="head">
          <span>*必須項目</span>
        </div>
        <Form
          onFinish={onSubmit}
          form={formUserBank}
          onFinishFailed={handleError}
          onValuesChange={handleValueChange}
          autoComplete="off"
          onFieldsChange={handleFieldsChange}
        >
          <div className="form-group">
            <Spin spinning={loading}>
              <Form.Item
                name="bank_name"
                className="form-group-bottom"
                rules={[
                  {
                    required: true,
                    message: '金融機関名を入力してください',
                  },
                ]}
              >
                <Select
                  showSearch
                  options={banks}
                  dropdownStyle={dropDownStyles}
                  popupClassName="ant-select-dropdow-custom"
                  placeholder="金融機関名"
                  open={dataInputTypingBank !== '' ? true : false}
                  onDropdownVisibleChange={handleDropdownVisibleChange}
                  onChange={(value, option) => handleOnChangeBank(value, option)}
                  className={isFocusBank ? 'input-global bank-select blur-focus' : 'input-global bank-select'}
                  onFocus={(): void => {
                    setIsFocusBank(true);
                  }}
                  onBlur={(): void => {
                    setIsFocusBank(false);
                  }}
                  suffixIcon={
                    <>
                      <img src={image.iconSearch} alt="Error" />
                      <span className="star">*</span>
                    </>
                  }
                  onSelect={(): void => {
                    setDataInputTypingBank('');
                    setIsFocusBank(false);
                  }}
                  getPopupContainer={() => {
                    let bankSelectElement: any = document.body.getElementsByClassName('bank-select');
                    return bankSelectElement[0];
                  }}
                  filterOption={(input: any, option: any) =>
                    option?.label.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                  }
                  onSearch={(value: string): void => {
                    setDataInputTypingBank(value);
                  }}
                />
              </Form.Item>
            </Spin>
          </div>
          <div className="form-group">
            <Form.Item
              style={{ width: '100%' }}
              name="store_name"
              rules={[
                {
                  required: true,
                  message: '支店名を入力してください',
                },
              ]}
            >
              <Select
                showSearch
                options={branches}
                // addonBefore={<>*</>}
                // suffixIcon={<span>*</span>}
                value={bankBranchDataUser}
                dropdownStyle={dropDownStyles}
                placeholder="支店名"
                className="input-global branch-select"
                onDropdownVisibleChange={handleDropdownVisibleChange}
                onChange={(value: any, option) => handleOnChangeBranch(value, option)}
                filterOption={(input: any, option: any): boolean =>
                  option?.label.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                }
                onSearch={(value: string): void => {
                  setDataInputTypingBranch(value);
                }}
                suffixIcon={
                  <>
                    <img src={image.iconSearch} alt="Error" />
                    <span className="star">*</span>
                  </>
                }
                getPopupContainer={() => {
                  let branchSelectElement: any = document.body.getElementsByClassName('branch-select');
                  return branchSelectElement[0];
                }}
              />
            </Form.Item>
          </div>
          <div className="form-group money">
            <label className="label">
              <span className="star-label">*</span>
              <span>預金種別</span>
            </label>
            <Form.Item
              name={'account_type'}
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <CheckboxCustom
                horizontal
                value={saveData}
                onChange={handleChange}
                error={showErrorAccount}
                options={optionBankMoney}
              />
            </Form.Item>
          </div>
          <div className="error-bank">
            {showErrorAccount ? <ErrorValidate errorText={'預金種別を入力してください'} /> : ''}
          </div>

          <div className="form-group input-account">
            <Form.Item
              name={'account_number'}
              className="form-group-bottom number"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]+$/),
                  message: '口座番号を入力してください',
                },
                {
                  max: 7,
                  message: '数字7ケタ以下',
                },
              ]}
            >
              <Input
                className="input-global"
                type="number"
                placeholder="口座番号"
                allowClear={true}
                addonBefore={<>*</>}
                onWheel={(event) => event.currentTarget.blur()}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <div className="note-bank">
              <span>※数字7ケタ以下。先頭の「0」の入力は不要です。</span>
            </div>
          </div>

          <div className="form-group">
            <Form.Item
              name={'account_name'}
              className="form-group-bottom final"
              rules={[
                {
                  required: true,
                  message: '口座名義を入力してください',
                },
              ]}
            >
              <Input
                className="input-global"
                type="text"
                placeholder="口座名義"
                allowClear={true}
                addonBefore={<>*</>}
              />
            </Form.Item>
          </div>

          <div className="bank-btn">
            <button
              type="button"
              className="btn"
              onClick={(): void => {
                if (editOnlyBank) {
                  navigate(config.routes.castInformation);
                } else {
                  if (editStatus) {
                    navigate(config.routes.editCast);
                  } else {
                    navigate(config.routes.castSignUp);
                  }
                }
              }}
            >
              戻る
            </button>

            <button
              type={statusCheckFieldEmpty ? 'submit' : 'button'}
              className={`btn ${statusCheckFieldEmpty ? 'ct-allow' : ' not-allowed'}`}
            >
              次へ
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpBank;
