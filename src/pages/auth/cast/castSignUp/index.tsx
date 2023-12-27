import { Dispatch } from 'redux';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { Form, FormInstance, Input, Modal, Button } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useNotification from 'antd/es/notification/useNotification';

import { alertFail, checkAge, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import { availableNow, availableServiceItems } from '../../../../utils/availableServiceItems';
import { transportationItems } from '../../../../utils/transportationItems';
import ErrorValidate from '../../../../components/validate/errorValidate';
import { getCastDetail } from '../../../../redux/services/castSlice';
import CheckboxCustom from '../../../../components/checkboxCustom';
import { CastSignUpPropsType } from '../../../../types/castTypes';
import { castExperience } from '../../../../utils/castExperience';
import StatusBar from '../../../../components/status/statusBar';
import { salaryItems } from '../../../../utils/salaryItems';
import { month } from '../../../../utils/monthValue';
import image from '../../../../assets/images/index';
import stationList from './mockupStationList.json';
import { postalCodeApi } from '../../../../api';
import config from '../../../../config';

const birthDayItems: any = [
  {
    id: 'year',
    visible: false,
  },
  {
    id: 'month',
    visible: false,
  },
  {
    id: 'day',
    visible: false,
  },
];

const listGender: any = [
  {
    label: '男性',
    value: 1,
  },
  {
    label: '女性',
    value: 2,
  },
  {
    label: 'その他',
    value: 3,
  },
];
const CastSignUp = ({ isEdit = false }: CastSignUpPropsType) => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = useNotification();
  const [formSignUp]: [FormInstance] = Form.useForm();

  const [showSalary, setShowSalary]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showExperience, setShowExperience]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorGender, setShowErrorGender]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorBirthday, setShowErrorBirthday]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showTransportation, setShowTransportation]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showAvailableService, setShowAvailableService]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  const [selectYear, setSelectYear]: [any, React.Dispatch<any>] = useState<any>('');
  const [valueDay, setValueDay]: [any, React.Dispatch<any>] = useState<any>([]);
  const [saveMonth, setSaveMonth]: [any, React.Dispatch<any>] = useState<any>([]);
  const [saveGender, setSaveGender]: [any, React.Dispatch<any>] = useState<any>([]);
  const [saveTransportation, setSaveTransportation]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveExperience, setSaveExperience]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveAvailableService, setSaveAvailableService]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveSalary, setSaveSalary]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveDay, setSaveDay]: [any, React.Dispatch<any>] = useState<any>('');
  const [selectDay, setSelectDay]: [any, React.Dispatch<any>] = useState<any>([]);
  const [showBirthday, setShowBirthday]: [any, React.Dispatch<any>] = useState<any>(birthDayItems);
  const [submittable, setSubmittable]: any = useState(false);

  let year: any = [];

  // REDUCER
  const { castDetails } = useSelector((state: any) => state.castReducer);

  const user = getLocalStorage('usr');
  const userData = getLocalStorage('usrdt');
  const userEditStatus = getLocalStorage('usredt');

  useEffect((): void => {
    if (isEdit && userEditStatus === null) {
      dispatch(getCastDetail());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  // Set default email

  useEffect((): void => {
    if (isEdit) {
      if (userEditStatus === null) {
        localStorage.removeItem('usrdt');
        localStorage.removeItem('usrbdt');
        const tmpDate: Date = new Date(castDetails?.date_of_birth);

        const filterTransportationValue: any = transportationItems?.filter(
          (item: any): boolean => item.id === castDetails?.transportation,
        );
        const filterExperience: any = castExperience?.filter(
          (item: any): any => item.id === castDetails?.cast_detail?.year_experience,
        );
        const filterAvailableService: any = availableServiceItems?.filter(
          (item: any): boolean => item.id === castDetails?.cast_detail?.available_service,
        );
        const filterSalary: any = salaryItems?.filter(
          (item: any): boolean => item.id === castDetails?.cast_detail?.salary,
        );

        const dataEdit: any = {
          name: castDetails?.name,
          name_furigana: castDetails?.name_furigana,
          email: castDetails?.email,
          confirm_email: castDetails?.email,
          ecn: castDetails?.cast_detail?.ecn,
          gender: castDetails?.gender,
          city: castDetails?.city,
          year: Number.isNaN(tmpDate.getFullYear()) ? '' : tmpDate.getFullYear(),
          month: Number.isNaN(tmpDate.getMonth())
            ? ''
            : tmpDate.getMonth() + 1 < 10
            ? `0${tmpDate.getMonth() + 1}`
            : tmpDate.getMonth() + 1,
          day: Number.isNaN(tmpDate.getDate())
            ? ''
            : tmpDate.getDate() < 10
            ? `0${tmpDate.getDate()}`
            : tmpDate.getDate(),
          postal_code: castDetails?.postal_code,
          province: castDetails?.province,
          name_building: castDetails?.name_building,
          street: castDetails?.street,
          station: castDetails?.station,
          station_time: castDetails?.station_time,
          transportation: filterTransportationValue[0]?.title,
          etc_name: castDetails?.cast_detail?.etc_name,
          etc_relationship: castDetails?.cast_detail?.etc_relationship,
          description: castDetails?.description,
        };
        // set data when edit
        setSaveGender(castDetails?.gender);
        setSaveTransportation(castDetails?.transportation);
        setSaveExperience(castDetails?.cast_detail?.year_experience);
        setSaveAvailableService(castDetails?.cast_detail?.available_service);
        setSaveSalary(castDetails?.cast_detail?.salary);
        setSubmittable(true);

        formSignUp.setFieldValue('year_experience', filterExperience[0]?.title);
        formSignUp.setFieldValue('available_service', filterAvailableService[0]?.title);
        formSignUp.setFieldValue('salary', filterSalary[0]?.title);
        formSignUp.setFieldsValue(dataEdit);
      } else {
        const filterTransportationValue: any = transportationItems?.filter(
          (item: any): boolean => item.id === userData?.transportation,
        );
        const filterExperience: any = castExperience?.filter(
          (item: any): boolean => item?.id === userData?.year_experience,
        );
        const filterAvailableService: any = availableServiceItems?.filter(
          (item: any): boolean => item.id === userData?.available_service,
        );
        const filterSalary: any = salaryItems?.filter((item: any): boolean => item?.id === userData?.salary);

        const dataEdit: any = {
          name: userData?.name,
          name_furigana: userData?.name_furigana,
          email: userData?.email,
          confirm_email: userData?.email,
          ecn: userData?.ecn,
          year: userData?.year,
          month: userData?.month,
          day: userData?.day,
          gender: userData?.gender,
          postal_code: userData?.postal_code,
          province: userData?.province,
          name_building: userData?.name_building,
          street: userData?.street,
          station: userData?.station,
          city: userData?.city,
          station_time: userData?.station_time,
          transportation: filterTransportationValue[0]?.title,
          etc_name: userData?.etc_name,
          etc_relationship: userData?.etc_relationship,
          description: userData?.description,
        };

        setSaveGender(userData?.gender);
        setSaveTransportation(userData?.transportation);
        setSaveExperience(userData?.year_experience);
        setSaveAvailableService(userData?.available_service);
        setSaveSalary(userData?.salary);
        setSubmittable(true);

        formSignUp.setFieldValue('year_experience', filterExperience[0]?.title);
        formSignUp.setFieldValue('available_service', filterAvailableService[0]?.title);
        formSignUp.setFieldValue('salary', filterSalary[0]?.title);
        formSignUp.setFieldValue('station', userData?.station);
        formSignUp.setFieldsValue(dataEdit);
      }
    } else {
      if (user !== null) {
        const data = {
          email: user?.value?.email,
          confirm_email: user?.value?.email,
        };
        formSignUp.setFieldsValue(data);
      }
      if (userData !== null) {
        const filterStation = stationList.find((item: any) => item.value === userData?.station);
        const filterSalary = salaryItems?.filter((item: any) => item.id === userData?.salary);
        const filterTransportationValue = transportationItems?.filter(
          (item: any) => item.id === userData?.transportation,
        );
        const filterExperience = castExperience?.filter((item: any) => item?.id === userData?.year_experience);
        const filterAvailableService = availableServiceItems?.filter(
          (item: any) => item.id === userData?.available_service,
        );

        setSaveGender(userData.gender);
        setSaveTransportation(filterTransportationValue[0]?.id);
        setSaveExperience(filterExperience[0]?.id);
        setSaveAvailableService(filterAvailableService[0]?.id);
        setSaveSalary(filterSalary[0]?.id);
        setSubmittable(true);

        formSignUp.setFieldsValue(userData);
        formSignUp.setFieldValue('transportation', filterTransportationValue[0]?.title);
        formSignUp.setFieldValue('year_experience', filterExperience[0]?.title);
        formSignUp.setFieldValue('available_service', filterAvailableService[0]?.title);
        formSignUp.setFieldValue('salary', filterSalary[0]?.title);
        // formSignUp.setFieldValue('station', filterStation?.label);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castDetails]);

  const editSignup = getLocalStorage('usresu');

  // Calculate date

  const date: number = new Date().getFullYear() - 19;

  for (let i: number = date; i > 1942; i--) {
    year.push({ value: i, label: i });
  }
  useEffect((): void => {
    if (selectYear !== '' && saveMonth !== '' && saveDay !== '') {
      const tmpAgeValue = {
        year: selectYear,
        month: parseInt(saveMonth),
        day: parseInt(saveDay),
      };
      const checkBirthday: boolean | undefined = checkAge(tmpAgeValue);
      if (checkBirthday) {
        setShowErrorBirthday(false);
        formSignUp.setFields([
          {
            name: 'year',
            errors: undefined,
          },
          {
            name: 'month',
            errors: undefined,
          },
          {
            name: 'day',
            errors: undefined,
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectYear, saveMonth, saveDay]);

  const generateDay = useCallback(
    (month: any): void => {
      setSaveMonth(month);
      if (
        month === '01' ||
        month === '03' ||
        month === '05' ||
        month === '07' ||
        month === '08' ||
        month === '10' ||
        month === '12'
      ) {
        setSelectDay(31);
      } else if (month === '04' || month === '06' || month === '09' || month === '11') {
        setSelectDay(30);
      } else if (new Date(selectYear, 1, 29).getMonth() === 1) {
        setSelectDay(29);
      } else {
        setSelectDay(28);
      }
    },
    [selectYear],
  );

  useEffect((): void => {
    generateDay(saveMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectYear]);

  useEffect((): void => {
    const tmpDay = [];
    for (let i: number = 1; i <= selectDay; i++) {
      if (i < 10) {
        tmpDay.push({ value: `0${i}`, label: `0${i}` });
      } else {
        tmpDay.push({ value: i, label: i });
      }
    }
    setValueDay(tmpDay);
  }, [selectDay]);

  const handleShowBirthday = (value: string): void => {
    const tmpData = showBirthday?.map((item: any): any => {
      if (item?.id === value) {
        return {
          ...item,
          visible: !item.visible,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setShowBirthday(tmpData);
  };

  // SUBMIT DATA

  const onSubmit = async (values: any): Promise<void> => {
    // Calculate Age
    const tmpAgeValue = {
      year: selectYear,
      month: parseInt(saveMonth),
      day: parseInt(saveDay),
    };
    const calculateDate: boolean | undefined = checkAge(tmpAgeValue);

    if (submittable) {
      if (calculateDate) {
        if (isEdit) {
          const userData = {
            name: values.name,
            name_furigana: values.name_furigana,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
            ecn: values.ecn,
            year: values.year,
            month: values.month,
            day: values.day,
            gender: saveGender,
            postal_code: values.postal_code,
            province: values.province,
            name_building: values.name_building,
            street: values.street,
            station: values.station,
            station_time: values.station_time,
            transportation: saveTransportation,
            etc_name: values.etc_name,
            etc_relationship: values.etc_relationship,
            year_experience: saveExperience,
            available_service: saveAvailableService,
            salary: saveSalary,
            description: values.description,
            city: values.city,
          };
          if (userEditStatus === null) {
            const userBankData = {
              bank_name: castDetails?.cast_detail?.bank_name,
              account_name: castDetails?.cast_detail?.account_name,
              account_number: castDetails?.cast_detail?.account_number,
              account_type: castDetails?.cast_detail?.account_type,
              store_name: castDetails?.cast_detail?.store_name,
            };
            setLocalStorage('usrbdt', userBankData);
          }
          setLocalStorage('usrdt', userData);
          setLocalStorage('usredt', true);
          navigate(config.routes.signUpBankEdit);
        } else {
          if (values.password === values.password_confirmation) {
            const userData = {
              name: values.name,
              name_furigana: values.name_furigana,
              email: values.email,
              password: values.password,
              password_confirmation: values.password_confirmation,
              ecn: values.ecn,
              year: values.year,
              month: values.month,
              day: values.day,
              gender: saveGender,
              postal_code: values.postal_code,
              province: values.province,
              name_building: values.name_building,
              street: values.street,
              station: values.station,
              station_time: values.station_time,
              transportation: saveTransportation,
              etc_name: values.etc_name,
              etc_relationship: values.etc_relationship,
              year_experience: saveExperience,
              available_service: saveAvailableService,
              salary: saveSalary,
              description: values.description,
              city: values.city,
              role: 1,
              token: user.value.token,
            };
            setLocalStorage('usrdt', userData);
            navigate(config.routes.signUpBank);
          } else {
            formSignUp.setFields([
              {
                name: 'confirm_password',
                errors: ['パスワードが一致しません'],
              },
            ]);
          }
        }
      } else {
        setShowErrorBirthday(true);
        formSignUp.setFields([
          {
            name: 'year',
            errors: [''],
          },
          {
            name: 'month',
            errors: [''],
          },
          {
            name: 'day',
            errors: [''],
          },
        ]);
      }
    }
  };

  // HANDLE ERROR FORM

  const handleError = ({ _, errorFields, __ }: any): void => {
    const filterError = errorFields?.filter(
      (item: any) => item.name[0] === 'year' || item.name[0] === 'month' || item.name[0] === 'day',
    );

    const filterGenderError = errorFields?.filter((item: any): boolean => item.name[0] === 'gender');

    if (filterError?.length !== 0) {
      setShowErrorBirthday(true);
    }
    if (filterError?.length === 0) {
      setShowErrorBirthday(false);
      formSignUp.setFields([
        {
          name: 'year',
          errors: undefined,
        },
        {
          name: 'month',
          errors: undefined,
        },
        {
          name: 'day',
          errors: undefined,
        },
      ]);
    }

    //   CHECK GENDER

    if (filterGenderError.length !== 0) {
      setShowErrorGender(true);
      formSignUp.setFields([
        {
          name: 'gender',
          errors: [''],
        },
      ]);
    } else {
      setShowErrorGender(false);
      formSignUp.setFields([
        {
          name: 'gender',
          errors: undefined,
        },
      ]);
    }
  };

  const handleCastCheckbox = (value: any): void => {
    setSaveGender(value);
    setShowErrorGender(false);
    handleCheckModalValue();
  };

  const handleChangeFields = (changedFields: any, allFields: any): void => {
    const filterRequireField = allFields?.filter(
      (item: any) => item?.name[0] !== 'description' && item?.name[0] !== 'name_building',
    );
    const checkEmpty = filterRequireField?.find(
      (field: any) => field.value === undefined || field.value === '' || field.value === null,
    );

    if (checkEmpty) {
      setSubmittable(false);
    }
    if (!checkEmpty) {
      setSubmittable(true);
    }

    const password = formSignUp?.getFieldValue('password');
    const passwordConfirm = formSignUp?.getFieldValue('password_confirmation');
    if (changedFields[0]?.name[0] === 'password_confirmation') {
      if (changedFields[0]?.value !== password) {
        formSignUp.setFields([
          {
            name: 'password_confirmation',
            errors: ['パスワードが一致しません'],
          },
        ]);
      } else {
        formSignUp.setFields([
          {
            name: 'password_confirmation',
            errors: undefined,
          },
        ]);
      }
    }
    if (changedFields[0]?.name[0] === 'password') {
      if (passwordConfirm !== '' && passwordConfirm !== undefined) {
        if (changedFields[0]?.value !== passwordConfirm) {
          formSignUp.setFields([
            {
              name: 'password_confirmation',
              errors: ['パスワードが一致しません'],
            },
          ]);
        } else {
          formSignUp.setFields([
            {
              name: 'password_confirmation',
              errors: undefined,
            },
          ]);
        }
      }
    }
  };

  // HANDLE POSTALCODE
  const handleGetPostalCode = async (e: any): Promise<void> => {
    e.preventDefault();

    const postalCodeData = formSignUp.getFieldValue('postal_code');
    if (postalCodeData !== '' && postalCodeData !== undefined) {
      try {
        const res: any = await postalCodeApi.getPostalCode(postalCodeData);
        if (res?.status === 'success') {
          if (res?.data?.length !== 0 && res?.data?.message !== 'API rate limit exceeded') {
            formSignUp.setFields([
              {
                name: 'province',
                value: res?.data[0]?.pref,
                errors: undefined,
              },
              {
                name: 'city',
                value: `${res?.data[0]?.city} ${res?.data[0]?.town}`,
                errors: undefined,
              },
            ]);
            handleCheckModalValueForPostalCode();
          } else {
            alertFail(api, 'ご指定された郵便番号は見つかりませんでした。');
          }
        }
      } catch (e) {}
    }
  };

  const handleCheckModalValue = () => {
    const allFieldValue = formSignUp.getFieldsValue();

    if (
      allFieldValue?.etc_name &&
      allFieldValue?.etc_relationship &&
      allFieldValue?.ecn &&
      allFieldValue?.available_service &&
      allFieldValue?.year &&
      allFieldValue?.month &&
      allFieldValue?.day &&
      allFieldValue?.gender !== null &&
      allFieldValue?.gender !== undefined &&
      allFieldValue?.year_experience &&
      allFieldValue?.transportation &&
      allFieldValue?.confirm_email &&
      allFieldValue?.email &&
      allFieldValue?.name &&
      allFieldValue?.name_furigana &&
      allFieldValue?.password &&
      allFieldValue?.password_confirmation &&
      allFieldValue?.postal_code &&
      allFieldValue?.province &&
      allFieldValue?.station &&
      allFieldValue?.station_time &&
      allFieldValue?.street &&
      allFieldValue?.salary &&
      allFieldValue?.city
    ) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  };

  const handleCheckModalValueForPostalCode = () => {
    const allFieldValue = formSignUp.getFieldsValue();

    if (
      allFieldValue?.etc_name &&
      allFieldValue?.etc_relationship &&
      allFieldValue?.ecn &&
      allFieldValue?.available_service &&
      allFieldValue?.year &&
      allFieldValue?.month &&
      allFieldValue?.day &&
      allFieldValue?.gender !== null &&
      allFieldValue?.gender !== undefined &&
      allFieldValue?.year_experience &&
      allFieldValue?.transportation &&
      allFieldValue?.confirm_email &&
      allFieldValue?.email &&
      allFieldValue?.name &&
      allFieldValue?.name_furigana &&
      allFieldValue?.postal_code &&
      allFieldValue?.station &&
      allFieldValue?.station_time &&
      allFieldValue?.street &&
      allFieldValue?.salary
    ) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  };

  return (
    <>
      {showPopup}
      <Modal
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        maskStyle={{ pointerEvents: 'none' }}
        open={showBirthday[0]?.visible}
        footer={false}
        className="modal-date"
        closeIcon={
          <>
            <img src={image.iconClose} alt="Error" />
          </>
        }
        onCancel={(): void => {
          handleShowBirthday('year');
        }}
      >
        {year.map((yearItem: any) => {
          return (
            <p
              key={yearItem.value}
              onClick={(): void => {
                handleShowBirthday('year');
                setSelectYear(yearItem.value);
                formSignUp.setFieldValue('year', yearItem.value);
                handleCheckModalValue();
              }}
            >
              {yearItem.value}
            </p>
          );
        })}
      </Modal>
      <Modal
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        open={showBirthday[1]?.visible}
        footer={false}
        onCancel={(): void => {
          handleShowBirthday('month');
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="Error" />
          </>
        }
      >
        {month.map((monthItem: any) => {
          return (
            <p
              key={monthItem.value}
              onClick={(): void => {
                handleShowBirthday('month');
                generateDay(monthItem.value);
                handleCheckModalValue();
                formSignUp.setFieldValue('month', monthItem.value);
              }}
            >
              {monthItem.value}
            </p>
          );
        })}
      </Modal>
      <Modal
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        open={showBirthday[2]?.visible}
        footer={false}
        onCancel={(): void => {
          handleShowBirthday('day');
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
      >
        {valueDay.map((dayItem: any) => {
          return (
            <p
              key={dayItem.value}
              onClick={(): void => {
                handleShowBirthday('day');
                setSaveDay(dayItem.value);
                handleCheckModalValue();
                formSignUp.setFieldValue('day', dayItem.value);
              }}
            >
              {dayItem.value}
            </p>
          );
        })}
      </Modal>
      <Modal
        open={showTransportation}
        footer={false}
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        onCancel={(): void => {
          setShowTransportation(false);
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
      >
        {transportationItems?.map((item: any) => {
          return (
            <p
              key={item.id}
              onClick={(): void => {
                formSignUp.setFieldValue('transportation', item.title);
                formSignUp.setFields([{ name: 'transportation', errors: undefined }]);
                setSaveTransportation(item.id);
                handleCheckModalValue();
                setShowTransportation(false);
              }}
            >
              {item.title}
            </p>
          );
        })}
      </Modal>
      {/* MODAL EXPERIENCE */}
      <div className={`signup-container ${isEdit ? 'container-680' : 'container-630'}`}>
        {isEdit ? (
          <div className="head-title">
            <h2>会員情報の変更</h2>
          </div>
        ) : (
          <StatusBar page1={true} />
        )}
        <div className="signup-container-content">
          <div className="signup-form">
            <div className="head">
              <span>*必須項目</span>
            </div>
            <Form
              form={formSignUp}
              onFinish={onSubmit}
              onFinishFailed={handleError}
              autoComplete="off"
              onFieldsChange={handleChangeFields}
            >
              <div className="form-group">
                <Form.Item
                  name="name"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: '氏名を入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    addonBefore={<>*</>}
                    type="text"
                    placeholder="氏名"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group">
                <span className="star">*</span>
                <Form.Item
                  name="name_furigana"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: 'ふりがなを入力してください',
                    },
                    {
                      pattern: /^[[\u3041-\u3096\u309D-\u309F]|\uD82C\uDC01|\uD83C\uDE00]*$/,
                      // pattern: /^[ぁ-んー]*$/,
                      message: 'ひらがなで入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="ふりがな"
                    addonBefore={<>*</>}
                    autoComplete="off"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group">
                <span className="star">*</span>
                <Form.Item
                  name="email"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: `メールアドレスを入力してください`,
                    },
                  ]}
                >
                  <Input disabled className="input-global" type="email" placeholder="" />
                </Form.Item>
              </div>
              <div className="form-group">
                <span className="star">*</span>
                <Form.Item
                  name="confirm_email"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: 'メールアドレスが一致しません',
                    },
                  ]}
                >
                  <Input disabled className="input-global" type="email" placeholder="" />
                </Form.Item>
              </div>
              {!isEdit ? (
                <>
                  <div className="block-passwd">
                    <div className="form-group">
                      <Form.Item
                        name="password"
                        style={{ width: '100%' }}
                        rules={[
                          {
                            required: true,
                            pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                            message: (
                              <>
                                パスワードを入力してください <br />
                                半角英数字・記号で8文字以上、12文字以下でご登録ください。
                                <br />
                                (大文字、小文字、数字、記号 全てを含めてください)
                              </>
                            ),
                          },
                        ]}
                      >
                        <Input.Password
                          autoComplete="new-password"
                          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                          className="input-global"
                          placeholder="パスワード"
                          addonBefore={<>*</>}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-checkbox">
                      <input
                        onChange={(): void => {
                          setPasswordVisible((prevState: boolean) => !prevState);
                        }}
                        checked={passwordVisible}
                        type="checkbox"
                      />
                      <span>パスワードを表示</span>
                    </div>
                  </div>
                  <div className="note">
                    <span>
                      ※半角英数字・記号で8文字以上、12文字以下でご登録ください。
                      <br />
                      &nbsp;&nbsp;&nbsp;（大文字、小文字、数字、記号 全てを含めてください）
                    </span>
                  </div>
                  <div className="block-passwd">
                    <div className="form-group">
                      <span className="star">*</span>
                      <Form.Item
                        name="password_confirmation"
                        style={{ width: '100%' }}
                        rules={[
                          {
                            required: true,
                            message: 'パスワードが一致しません',
                          },
                        ]}
                      >
                        <Input.Password
                          autoComplete="off"
                          visibilityToggle={{
                            visible: passwordConfirmVisible,
                            onVisibleChange: setPasswordConfirmVisible,
                          }}
                          className="input-global"
                          placeholder="パスワード確認"
                          addonBefore={<>*</>}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-checkbox">
                      <input
                        onChange={(): void => {
                          setPasswordConfirmVisible((prevState: boolean) => !prevState);
                        }}
                        checked={passwordConfirmVisible}
                        type="checkbox"
                      />
                      <span>パスワードを表示</span>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              <div className="form-group dob">
                <label htmlFor="">
                  <span className="star-label">*</span>
                  生年月日
                </label>
                <div className="dob-input">
                  <div className="dob-element" onClick={() => handleShowBirthday('year')}>
                    <Form.Item
                      name={'year'}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                    >
                      <Input
                        maxLength={0}
                        value={selectYear}
                        className="input-global"
                        type="text"
                        placeholder="0000"
                        readOnly={true}
                      />
                    </Form.Item>
                    <span>年</span>
                  </div>
                  <div className="dob-element " onClick={() => handleShowBirthday('month')}>
                    <Form.Item name={'month'} rules={[{ required: true, message: '' }]}>
                      <Input
                        maxLength={0}
                        value={saveMonth}
                        className="input-global"
                        type="text"
                        placeholder="00"
                        readOnly={true}
                      />
                    </Form.Item>
                    <span>月</span>
                  </div>
                  <div className="dob-element " onClick={() => handleShowBirthday('day')}>
                    <Form.Item name={'day'} rules={[{ required: true, message: '' }]}>
                      <Input
                        maxLength={0}
                        value={saveDay}
                        className="input-global"
                        type="text"
                        placeholder="00"
                        readOnly={true}
                      />
                    </Form.Item>
                    <span>日</span>
                  </div>
                </div>
              </div>
              <div className="age-note">
                <div className="error-age">
                  <ErrorValidate errorText="※ご注意：18歳未満はご登録できません" />
                </div>
                {showErrorBirthday ? (
                  <>
                    <ErrorValidate errorText="生年月日を入力してください" />
                  </>
                ) : (
                  ''
                )}
              </div>
              <div className="form-check-gender">
                <div className="form-group gender">
                  <label className="label">
                    <span className="star-label">*</span>
                    <span>性別</span>
                  </label>
                  <Form.Item name={'gender'} rules={[{ required: true, message: '' }]}>
                    <CheckboxCustom
                      options={listGender}
                      onChange={handleCastCheckbox}
                      value={saveGender}
                      horizontal
                      error={showErrorGender}
                    />
                  </Form.Item>
                </div>
                <div className="error-bank">
                  {showErrorGender ? <ErrorValidate errorText={'性別を入力してください'} /> : ''}
                </div>
              </div>
              <div className="form-group form-group-bottom auto-search-container street">
                <Form.Item name={'postal_code'} rules={[{ required: true, message: '郵便番号を入力してください' }]}>
                  <Input
                    className="input-global mb-1"
                    type="text"
                    placeholder="〒"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
                <button
                  className="auto-search btn"
                  onClick={(e: React.MouseEvent<any>) => handleGetPostalCode(e)}
                  type="button"
                >
                  自動検索
                </button>
              </div>
              <div className="form-group form-group-bottom">
                <span className="star">*</span>
                <Form.Item
                  name={'province'}
                  rules={[
                    {
                      required: true,
                      message: '都道府県を入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="都道府県"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item name={'city'} rules={[{ required: true, message: '市区町村を入力してください' }]}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="市区町村"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom">
                {/* <span className="star">*</span> */}
                <Form.Item
                  name={'street'}
                  rules={[
                    {
                      required: true,
                      message: '丁目番地を入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    addonBefore={<>*</>}
                    type="text"
                    placeholder="丁目番地（数字は半角英数で登録ください）"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom form-no-required">
                <Form.Item name={'name_building'}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="建物名・号室（数字は半角英数で登録ください）"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div
                className="form-group form-group-bottom"
                // onClick={() => handleDisplayModalNearestStation()}
              >
                <Form.Item name={'station'} rules={[{ required: true, message: '最寄り駅を入力してください' }]}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="最寄り駅（◯◯線△△駅）"
                    // readOnly
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div
                className="form-group form-group-bottom"
                onClick={(): void => {
                  setShowTransportation(true);
                }}
              >
                <Form.Item
                  name={'transportation'}
                  rules={[{ required: true, message: '最寄駅からの移動手段を入力してください' }]}
                >
                  <Input
                    maxLength={0}
                    readOnly={true}
                    type="text"
                    className="input-global "
                    placeholder="最寄り駅からの移動手段"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item
                  name={'station_time'}
                  rules={[{ required: true, message: '最寄り駅からの時間を入力してください' }]}
                >
                  <Input
                    className="input-global"
                    type="number"
                    placeholder="最寄り駅からの時間（分)"
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
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item
                  name={'ecn'}
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: '緊急連絡先 電話番号を入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    type="number"
                    placeholder="緊急連絡先 電話番号"
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
              </div>
              <div className="note letter-phone">
                <span>※</span>
                <span>
                  成人されているご家族・ご親族様（内縁も含む）、婚約者様の電話番号を
                  <br />
                  　ご入力ください
                </span>
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item name={'etc_name'} rules={[{ required: true, message: '緊急連絡先 氏名を入力してください' }]}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="緊急連絡先 氏名"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item
                  name={'etc_relationship'}
                  rules={[
                    {
                      required: true,
                      message: '緊急連絡先 続柄を入力してください',
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="緊急連絡先 続柄"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <Modal
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
                open={showExperience}
                footer={false}
                onCancel={() => {
                  setShowExperience(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
              >
                {castExperience?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={() => {
                        formSignUp.setFieldValue('year_experience', item.title);
                        formSignUp.setFields([{ name: 'year_experience', errors: undefined }]);
                        setSaveExperience(item.id);
                        handleCheckModalValue();
                        setShowExperience(false);
                      }}
                    >
                      {item.title}
                    </p>
                  );
                })}
              </Modal>
              <div
                className="form-group form-group-bottom"
                onClick={(): void => {
                  setShowExperience(true);
                }}
              >
                <Form.Item
                  name={'year_experience'}
                  rules={[{ required: true, message: '家事経験年数を入力してください' }]}
                >
                  <Input
                    className="input-global"
                    maxLength={0}
                    readOnly={true}
                    type="text"
                    placeholder="家事経験年数"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/* ---------------------- AVAILABEL SERVICE -------------------------*/}
              <Modal
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
                open={showAvailableService}
                footer={false}
                onCancel={(): void => {
                  setShowAvailableService(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
              >
                {availableNow?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('available_service', item.title);
                        formSignUp.setFields([{ name: 'available_service', errors: undefined }]);
                        setSaveAvailableService(item.id);
                        handleCheckModalValue();
                        setShowAvailableService(false);
                      }}
                    >
                      {item.title}
                    </p>
                  );
                })}
              </Modal>
              <div
                className="form-group form-group-bottom"
                onClick={(): void => {
                  setShowAvailableService(true);
                }}
              >
                <Form.Item
                  name={'available_service'}
                  rules={[{ required: true, message: '可能提供サービスを入力してください' }]}
                >
                  <Input
                    className="input-global"
                    maxLength={0}
                    readOnly={true}
                    type="text"
                    placeholder="可能提供サービス "
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/* ---------------------- SALARY -------------------------*/}

              <Modal
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
                open={showSalary}
                footer={false}
                onCancel={(): void => {
                  setShowSalary(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
              >
                {salaryItems?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={() => {
                        formSignUp.setFieldValue('salary', item.title);
                        formSignUp.setFields([{ name: 'salary', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveSalary(item.id);
                        setShowSalary(false);
                      }}
                    >
                      {item.title}
                    </p>
                  );
                })}
              </Modal>

              <div
                className="form-group form-group-bottom"
                onClick={() => {
                  setShowSalary(true);
                }}
              >
                <Form.Item name={'salary'} rules={[{ required: true, message: 'ご希望の月間報酬を入力してください' }]}>
                  <Input
                    className="input-global"
                    maxLength={0}
                    readOnly={true}
                    type="text"
                    placeholder="ご希望の月間報酬"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom form-group-textarea">
                <Form.Item name={'description'} label={'備考'}>
                  <Input.TextArea className="textarea-global" />
                </Form.Item>
              </div>
              <div className="btn-signup-bottom">
                {isEdit ? (
                  <div className="btn-cast-edit">
                    <Button
                      type="ghost"
                      htmlType="button"
                      className="btn"
                      onClick={() => {
                        editSignup ? navigate(config.routes.castInformation) : navigate(config.routes.castDetails);
                      }}
                    >
                      戻る
                    </Button>
                    <Button className={`btn${submittable ? ' ct-allow' : ' not-allowed'}`} htmlType="submit">
                      次へ
                    </Button>
                  </div>
                ) : (
                  <div>
                    <button
                      type={submittable ? 'submit' : 'button'}
                      onClick={() => {
                        if (!submittable) {
                          return onSubmit;
                        }
                      }}
                      className={`btn ${submittable ? 'cr-allow' : 'not-allowed '}`}
                    >
                      振込先情報入力へ
                    </button>
                  </div>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CastSignUp;
