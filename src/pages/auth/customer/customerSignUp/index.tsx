import { Dispatch } from 'redux';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormInstance, Input, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useNotification from 'antd/es/notification/useNotification';

import { alertFail, checkAge, getLocalStorage, setLocalStorage } from '../../../../helper/common';
import StatusBarCustomer from '../../../../components/status/statusbarCustomer';
import { transportationItems } from '../../../../utils/transportationItems';
import { buildingHeightItems } from '../../../../utils/buildingHeightItems';
import ErrorValidate from '../../../../components/validate/errorValidate';
import { getCastDetail } from '../../../../redux/services/castSlice';
import CheckboxCustom from '../../../../components/checkboxCustom';
import { CapacityKItems } from '../../../../utils/capacityKItems';
import { CapacityMItems } from '../../../../utils/capacityMItems';
import { CastSignUpPropsType } from '../../../../types/castTypes';
import { BuildingType } from '../../../../utils/buildingType';
import { CAST_ROLE } from '../../../../utils/userRole';
import { JobItems } from '../../../../utils/jobItems';
import { month } from '../../../../utils/monthValue';
import image from '../../../../assets/images/index';
import { postalCodeApi } from '../../../../api';
import config from '../../../../config';

const defaultShowBirthday: any = [
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

const CustomerSignUp = ({ isEdit = false }: CastSignUpPropsType) => {
  const dispatch: Dispatch = useDispatch();
  const [api, showPopup]: any = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const [formSignUp]: [FormInstance] = Form.useForm();

  // HOOK STATE
  const [showJob, setShowJob]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showCapacityM, setShowCapacityM]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showCapacityK, setShowCapacityK]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorGender, setShowErrorGender]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showBuildingType, setShowBuildingType]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showErrorBirthday, setShowErrorBirthday]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showTransportation, setShowTransportation]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showBuildingHeight, setShowBuildingHeight]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  const [saveJob, setSaveJob]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveDay, setSaveDay]: [any, React.Dispatch<any>] = useState<any>('');
  const [selectYear, setSelectYear]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveCapacityM, setSaveCapacityM]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveCapacityK, setSaveCapacityK]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveBuildingType, setSaveBuildingType]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveTransportation, setSaveTransportation]: [any, React.Dispatch<any>] = useState<any>('');
  const [saveBuildingHeight, setSaveBuildingHeight]: [any, React.Dispatch<any>] = useState<any>('');

  const [valueDay, setValueDay]: [any, React.Dispatch<any>] = useState<any>([]);
  const [selectDay, setSelectDay]: [any, React.Dispatch<any>] = useState<any>([]);
  const [saveMonth, setSaveMonth]: [any, React.Dispatch<any>] = useState<any>([]);
  const [saveGender, setSaveGender]: [any, React.Dispatch<any>] = useState<any>([]);
  const [showBirthday, setShowBirthday]: [any, React.Dispatch<any>] = useState<any>(defaultShowBirthday);
  const [statusEmpty, setStatusEmpty]: any = useState(false);

  // REDUCER
  const { castDetails } = useSelector((state: any) => state.castReducer);

  let year: any[] = [];

  // GET DATA LOCAL
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

        const filterProfession: any = JobItems?.filter(
          (item: any): boolean => item.id === castDetails?.customer_detail?.profession,
        );
        const filterBuildingType: any = BuildingType?.filter(
          (item: any): boolean => item.id === castDetails?.customer_detail?.building_type,
        );
        const filterCapacityM: any = CapacityMItems?.filter(
          (item: any): boolean => item.id === castDetails?.customer_detail?.capacity_m,
        );
        const filterCapacityK: any = CapacityKItems?.filter(
          (item: any): boolean => item.id === castDetails?.customer_detail?.capacity_k,
        );
        const filterBuildingHeight: any = buildingHeightItems?.filter(
          (item: any): boolean => item.id === castDetails?.customer_detail?.building_height,
        );

        const dataEdit: any = {
          name: castDetails?.name,
          city: castDetails?.city,
          email: castDetails?.email,
          street: castDetails?.street,
          gender: castDetails?.gender,
          year: Number.isNaN(tmpDate?.getFullYear()) ? '' : tmpDate?.getFullYear(),
          station: castDetails?.station,
          province: castDetails?.province,
          confirm_email: castDetails?.email,
          postal_code: castDetails?.postal_code,
          description: castDetails?.description,
          capacity_m: filterCapacityM[0]?.title,
          capacity_k: filterCapacityK[0]?.title,
          station_time: castDetails?.station_time,
          profession: filterProfession[0]?.title,
          name_building: castDetails?.name_building,
          note: castDetails?.customer_detail?.note,
          name_furigana: castDetails?.name_furigana,
          building_type: filterBuildingType[0]?.title,
          building_height: filterBuildingHeight[0]?.title,
          transportation: filterTransportationValue[0]?.title,
          day: Number.isNaN(tmpDate?.getDate())
            ? ''
            : tmpDate?.getDate() < 10
            ? `0${tmpDate?.getDate()}`
            : tmpDate?.getDate(),
          month: Number.isNaN(tmpDate?.getMonth())
            ? ''
            : tmpDate?.getMonth() + 1 < 10
            ? `0${tmpDate?.getMonth() + 1}`
            : tmpDate?.getMonth() + 1,
        };

        // SET STATE
        setSaveGender(castDetails?.gender);
        setSaveJob(filterProfession[0]?.id);
        setSaveCapacityM(filterCapacityM[0]?.id);
        setSaveCapacityK(filterCapacityK[0]?.id);
        setSaveBuildingType(filterBuildingType[0]?.id);
        setSaveBuildingHeight(filterBuildingHeight[0]?.id);
        setSaveTransportation(castDetails?.transportation);
        setStatusEmpty(true);

        // SET DATA FORM
        formSignUp.setFieldsValue(dataEdit);
      } else {
        const filterTransportationValue: any = transportationItems?.filter(
          (item: any): boolean => item.id === userData?.transportation,
        );
        const filterProfession: any = JobItems?.filter((item: any): boolean => item.id === userData?.profession);
        const filterBuildingType: any = BuildingType?.filter(
          (item: any): boolean => item.id === userData?.building_type,
        );
        const filterCapacityM: any = CapacityMItems?.filter((item: any): boolean => item.id === userData?.capacity_m);
        const filterCapacityK: any = CapacityKItems?.filter((item: any): boolean => item.id === userData?.capacity_k);
        const filterBuildingHeight: any = buildingHeightItems?.filter(
          (item: any): boolean => item.id === userData?.building_height,
        );

        const dataEdit: any = {
          day: userData?.day,
          name: userData?.name,
          year: userData?.year,
          city: userData?.city,
          note: userData?.note,
          email: userData?.email,
          month: userData?.month,
          gender: userData?.gender,
          street: userData?.street,
          station: userData?.station,
          province: userData?.province,
          confirm_email: userData?.email,
          postal_code: userData?.postal_code,
          description: userData?.description,
          station_time: userData?.station_time,
          capacity_m: filterCapacityM[0]?.title,
          capacity_k: filterCapacityK[0]?.title,
          name_furigana: userData?.name_furigana,
          profession: filterProfession[0]?.title,
          name_building: userData?.name_building,
          building_type: filterBuildingType[0]?.title,
          building_height: filterBuildingHeight[0]?.title,
          transportation: filterTransportationValue[0]?.title,
        };

        // SET STATE
        setSaveGender(userData?.gender);
        setSaveJob(filterProfession[0]?.id);
        setSaveCapacityM(filterCapacityM[0]?.id);
        setSaveCapacityK(filterCapacityK[0]?.id);
        setSaveBuildingType(filterBuildingType[0]?.id);
        setSaveTransportation(userData?.transportation);
        setSaveBuildingHeight(filterBuildingHeight[0]?.id);
        setStatusEmpty(true);

        // SET DATA FORM
        formSignUp.setFieldsValue(dataEdit);
      }
    } else {
      if (user !== null) {
        const data: any = {
          email: user?.value?.email,
          confirm_email: user?.value?.email,
        };
        formSignUp.setFieldsValue(data);
      }
      if (userData !== null) {
        setSaveGender(userData.gender);
        const filterTransportationValue: any = transportationItems?.filter(
          (item: any): boolean => item.id === userData?.transportation,
        );
        const filterProfession: any = JobItems?.filter((item: any): boolean => item.id === userData?.profession);
        const filterBuildingType: any = BuildingType?.filter(
          (item: any): boolean => item.id === userData?.building_type,
        );
        const filterCapacityM: any = CapacityMItems?.filter((item: any): boolean => item.id === userData?.capacity_m);
        const filterCapacityK: any = CapacityKItems?.filter((item: any): boolean => item.id === userData?.capacity_k);
        const filterBuildingHeight: any = buildingHeightItems?.filter(
          (item: any): boolean => item.id === userData?.building_height,
        );

        // SET STATE
        setSaveJob(filterProfession[0]?.id);
        setSaveCapacityM(filterCapacityM[0]?.id);
        setSaveCapacityK(filterCapacityK[0]?.id);
        setSaveBuildingType(filterBuildingType[0]?.id);
        setSaveBuildingHeight(filterBuildingHeight[0]?.id);
        setSaveTransportation(filterTransportationValue[0]?.id);
        setStatusEmpty(true);

        // SET DATA FORM
        formSignUp.setFieldsValue(userData);
        formSignUp.setFieldValue('capacity_m', filterCapacityM[0]?.title);
        formSignUp.setFieldValue('capacity_k', filterCapacityK[0]?.title);
        formSignUp.setFieldValue('profession', filterProfession[0]?.title);
        formSignUp.setFieldValue('building_type', filterBuildingType[0]?.title);
        formSignUp.setFieldValue('building_height', filterBuildingHeight[0]?.title);
        formSignUp.setFieldValue('transportation', filterTransportationValue[0]?.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castDetails]);

  // CACULATE DATE
  const date: number = new Date().getFullYear() - 19;

  for (let i: number = date; i > 1942; i--) {
    year.push({ value: i, label: i });
  }

  useEffect((): void => {
    if (selectYear !== '' && saveMonth !== '' && saveDay !== '') {
      const tmpAgeValue: any = {
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
    const tmpDay: any = [];
    for (let i: number = 1; i <= selectDay; i++) {
      if (i < 10) {
        tmpDay.push({ value: `0${i}`, label: `0${i}` });
      } else {
        tmpDay.push({ value: i, label: i });
      }
    }
    setValueDay(tmpDay);
  }, [selectDay]);

  // HANDLE SHOW BIRTHDAY
  const handleShowBirthday = (value: string): void => {
    const tmpData = showBirthday.map((item: any): any => {
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
    if (statusEmpty) {
      // Calculate Age
      const tmpAgeValue: any = {
        year: selectYear,
        month: parseInt(saveMonth),
        day: parseInt(saveDay),
      };
      const calculateDate: boolean | undefined = checkAge(tmpAgeValue);

      if (calculateDate) {
        if (isEdit) {
          const userData: any = {
            day: values.day,
            year: values.year,
            name: values.name,
            city: values.city,
            note: values.note,
            gender: saveGender,
            email: values.email,
            month: values.month,
            profession: saveJob,
            street: values.street,
            station: values.station,
            province: values.province,
            capacity_m: saveCapacityM,
            capacity_k: saveCapacityK,
            postal_code: values.postal_code,
            description: values.description,
            building_type: saveBuildingType,
            station_time: values.station_time,
            transportation: saveTransportation,
            name_furigana: values.name_furigana,
            name_building: values.name_building,
            building_height: saveBuildingHeight,
          };

          // BANK DATA
          const userBankData: any = {
            card_type: castDetails?.customer_detail?.card_type,
            card_number: castDetails?.customer_detail?.card_number,
            card_holder: castDetails?.customer_detail?.card_holder,
            expired_date: castDetails?.customer_detail?.expired_date,
            security_code: castDetails?.customer_detail?.security_code,
          };

          // SET DATA LOCAL
          setLocalStorage('usrdt', userData);
          setLocalStorage('usrbdt', userBankData);
          setLocalStorage('usredt', true);

          // NAVIGATE
          navigate(config.routes.customerSignupBankEdit);
        } else {
          if (values.password === values.password_confirmation) {
            const userData: any = {
              day: values.day,
              name: values.name,
              year: values.year,
              note: values.note,
              city: values.city,
              gender: saveGender,
              profession: saveJob,
              email: values.email,
              month: values.month,
              street: values.street,
              station: values.station,
              password: values.password,
              province: values.province,
              capacity_m: saveCapacityM,
              capacity_k: saveCapacityK,
              postal_code: values.postal_code,
              description: values.description,
              building_type: saveBuildingType,
              station_time: values.station_time,
              transportation: saveTransportation,
              name_building: values.name_building,
              name_furigana: values.name_furigana,
              building_height: saveBuildingHeight,
              password_confirmation: values.password_confirmation,
              token: user?.value?.token,
              role: CAST_ROLE,
            };

            setLocalStorage('usrdt', userData);
            navigate(config.routes.customerSignupBank);
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

  const handleError = ({ _, errorFields, __ }: any): void => {
    // CHECK BIRTHDAY ERROR
    const filterBirthdayError = errorFields.filter(
      (item: any) => item.name[0] === 'year' || item.name[0] === 'month' || item.name[0] === 'day',
    );

    if (filterBirthdayError.length !== 0) {
      setShowErrorBirthday(true);
    }
    if (filterBirthdayError.length === 0) {
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

    // CHECK GENDER ERROR
    const filterGenderError = errorFields?.filter((item: any): boolean => item.name[0] === 'gender');

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

  const handleCustomerCheckbox = (value: any): void => {
    setSaveGender(value);
    setShowErrorGender(false);
  };

  const handleChangeFields = (changedFields: any, allFields: any): void => {
    const password = formSignUp.getFieldValue('password');
    const passwordConfirm = formSignUp.getFieldValue('password_confirmation');

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

    const filterRequireField = allFields?.filter(
      (item: any) => item?.name[0] !== 'note' && item?.name[0] !== 'description' && item?.name[0] !== 'name_building',
    );

    const checkEmpty = filterRequireField?.find(
      (field: any) => field.value === undefined || field.value === '' || field.value === null,
    );

    if (checkEmpty) {
      setStatusEmpty(false);
    }
    if (!checkEmpty) {
      setStatusEmpty(true);
    }
  };

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
      allFieldValue?.building_height &&
      allFieldValue?.building_type &&
      allFieldValue?.capacity_k &&
      allFieldValue?.capacity_m &&
      allFieldValue?.year &&
      allFieldValue?.month &&
      allFieldValue?.day &&
      allFieldValue?.gender &&
      allFieldValue?.profession &&
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
      allFieldValue?.street
    ) {
      setStatusEmpty(true);
    }
  };

  return (
    <>
      {showPopup}
      <Modal
        footer={false}
        className="modal-date"
        open={showBirthday[0]?.visible}
        onCancel={(): void => {
          handleShowBirthday('year');
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="Error" />
          </>
        }
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
      >
        {year?.map((yearItem: any, index: number) => {
          return (
            <p
              key={index}
              onClick={(): void => {
                setSelectYear(yearItem.value);
                handleShowBirthday('year');
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
        footer={false}
        open={showBirthday[1]?.visible}
        onCancel={(): void => {
          handleShowBirthday('month');
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="Error" />
          </>
        }
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
      >
        {month?.map((monthItem: any, index: number) => {
          return (
            <p
              key={index}
              onClick={(): void => {
                generateDay(monthItem.value);
                handleShowBirthday('month');
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
        footer={false}
        open={showBirthday[2]?.visible}
        onCancel={(): void => {
          handleShowBirthday('day');
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
      >
        {valueDay?.map((dayItem: any, index: number) => {
          return (
            <p
              key={index}
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
        footer={false}
        open={showTransportation}
        onCancel={(): void => {
          setShowTransportation(false);
        }}
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
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
      {/* <div className="signup-container-edit-title">
        {isEdit ? (
          <div className="signup-title">
            <h2>会員情報の変更</h2>
          </div>
        ) : (
          <></>
        )}
      </div> */}
      <div className={`signup-container ${isEdit ? 'container-680' : 'container-630'}`}>
        {isEdit ? (
          <div className="head-title">
            <h2>会員情報の変更</h2>
          </div>
        ) : (
          // <></>
          <StatusBarCustomer page1={true} />
        )}
        <div className="signup-container-content">
          <div className="signup-form">
            <div className="head">
              <span>*必須項目</span>
            </div>
            <Form
              form={formSignUp}
              autoComplete="off"
              onFinish={onSubmit}
              onFinishFailed={handleError}
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
                    type="text"
                    placeholder="氏名"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group">
                <Form.Item
                  name="name_furigana"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: 'ふりがなを入力してください',
                    },
                    {
                      // pattern: /^[ぁ-んー 　]*$/,
                      pattern: /^[[\u3041-\u3096\u309D-\u309F]|\uD82C\uDC01|\uD83C\uDE00]*$/,
                      message: 'ひらがなで入力してください',
                    },
                  ]}
                >
                  <Input
                    type="text"
                    allowClear={true}
                    autoComplete="off"
                    placeholder="ふりがな"
                    className="input-global"
                    addonBefore={<>*</>}
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
                      message: 'メールアドレスを入力してください',
                    },
                  ]}
                >
                  <Input disabled className="input-global" type="email" placeholder="tanaka@xxxxx.gmail.com" />
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
                  <Input disabled className="input-global" type="email" placeholder="tanaka@xxxxx.gmail.com" />
                </Form.Item>
              </div>
              {!isEdit ? (
                <>
                  <div className="block-passwd">
                    <div className="form-group">
                      <Form.Item
                        name="password"
                        validateTrigger={['onChange']}
                        style={{ width: '100%' }}
                        rules={[
                          {
                            required: true,
                            pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                            message: (
                              <>
                                パスワードを入力してください
                                <br />
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
                          placeholder="パスワード"
                          className="input-global"
                          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                          addonBefore={<>*</>}
                        />
                      </Form.Item>
                    </div>
                    <div className={'form-checkbox'}>
                      <input
                        onChange={() => {
                          setPasswordVisible((prevState: any) => !prevState);
                        }}
                        checked={passwordVisible}
                        className=""
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
                      <Form.Item
                        name="password_confirmation"
                        style={{ width: '100%' }}
                        validateTrigger={['']}
                        rules={[
                          {
                            required: true,
                            message: 'パスワードが一致しません',
                            pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                          },
                          // {
                          //   pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,12}$/,
                          //   message: 'パスワードは半角英数字・記号を使用し、8文字以上必要です',
                          // },
                        ]}
                      >
                        <Input.Password
                          autoComplete="off"
                          className="input-global"
                          placeholder="パスワード確認"
                          visibilityToggle={{
                            visible: passwordConfirmVisible,
                            onVisibleChange: setPasswordConfirmVisible,
                          }}
                          addonBefore={<>*</>}
                        />
                      </Form.Item>
                    </div>
                    <div className={'form-checkbox'}>
                      <input
                        onChange={(): void => {
                          setPasswordConfirmVisible((prevState: any) => !prevState);
                        }}
                        className=""
                        type="checkbox"
                        checked={passwordConfirmVisible}
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
                  <span className="star-label"> * </span>
                  <span>生年月日</span>
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
                        type="text"
                        maxLength={0}
                        readOnly={true}
                        value={selectYear}
                        placeholder="0000"
                        className="input-global"
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
                        type="text"
                        maxLength={0}
                        readOnly={true}
                        value={saveDay}
                        placeholder="00"
                        className="input-global"
                      />
                    </Form.Item>
                    <span>日</span>
                  </div>
                </div>
              </div>
              <div className="age-note">
                {showErrorBirthday ? (
                  <>
                    <ErrorValidate errorText="生年月日を入力してください" />
                  </>
                ) : (
                  ''
                )}
                <ErrorValidate errorText="※ご注意：18歳未満はご登録できません" />
              </div>
              <div className="form-check-gender">
                <div className="form-group gender">
                  <label className="label">
                    <span className="star-label">*</span>
                    <span>性別</span>
                  </label>
                  <Form.Item name={'gender'} rules={[{ required: true, message: '' }]}>
                    <CheckboxCustom
                      horizontal
                      value={saveGender}
                      options={listGender}
                      error={showErrorGender}
                      onChange={handleCustomerCheckbox}
                    />
                  </Form.Item>
                </div>
                <div className="error-bank">
                  {showErrorGender ? <ErrorValidate errorText={'性別を入力してください'} /> : ''}
                </div>
              </div>

              <Modal
                open={showJob}
                footer={false}
                onCancel={(): void => {
                  setShowJob(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
              >
                {JobItems?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('profession', item.title);
                        formSignUp.setFields([{ name: 'profession', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveJob(item.id);
                        setShowJob(false);
                      }}
                    >
                      {item.title}
                    </p>
                  );
                })}
              </Modal>

              <div
                className="form-group form-group-bottom job"
                onClick={(): void => {
                  setShowJob(true);
                }}
              >
                <Form.Item name={'profession'} rules={[{ required: true, message: 'ご職業を入力してください' }]}>
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    placeholder="ご職業"
                    className="input-global"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group auto-search-container">
                <Form.Item name={'postal_code'} rules={[{ required: true, message: '郵便番号を入力してください' }]}>
                  <Input
                    className="input-global postal_code"
                    placeholder="〒"
                    allowClear={true}
                    type="number"
                    addonBefore={<>*</>}
                    onWheel={(event) => event.currentTarget.blur()}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <button
                  className="btn btn-client auto-search "
                  onClick={(e: React.MouseEvent<any>) => handleGetPostalCode(e)}
                >
                  自動検索
                </button>
              </div>

              <div className="form-group form-group-bottom">
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
              <div className="form-group form-group-bottom ">
                <Form.Item name={'city'} rules={[{ required: true, message: '市区町村を入力してください' }]}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="市区町村"
                    addonBefore={<>*</>}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom ">
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
                    type="text"
                    addonBefore={<>*</>}
                    placeholder="丁目番地（数字は半角英数で登録ください）"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom form-no-required">
                <Form.Item
                  name={'name_building'}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="建物名・号室（数字は半角英数で登録ください）"
                    allowClear={true}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom">
                <Form.Item name={'station'} rules={[{ required: true, message: '最寄り駅を入力してください' }]}>
                  <Input
                    className="input-global"
                    type="text"
                    placeholder="最寄り駅"
                    allowClear={true}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/* ----------------------- TRANSPORTATION------------------------ */}

              <div
                className="form-group form-group-bottom"
                onClick={(): void => {
                  setShowTransportation(true);
                }}
              >
                <Form.Item
                  name={'transportation'}
                  rules={[{ required: true, message: '最寄り駅からの移動手段を入力してください' }]}
                >
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    className="input-global"
                    placeholder="最寄り駅からの移動手段"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>
              <div className="form-group form-group-bottom form-group-textarea form-no-required">
                <Form.Item name={'note'} label="移動手段の詳細">
                  <Input.TextArea
                    className="textarea-global"
                    placeholder="例）最寄駅のXX駅で降りて、XX行きのバスを利用、「XXXX」で下車、徒歩10分"
                    bordered={true}
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

              {/* -------------------- BUILDING TYPE ------------------------ */}

              <Modal
                footer={false}
                open={showBuildingType}
                onCancel={(): void => {
                  setShowBuildingType(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
              >
                {BuildingType?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('building_type', item.title);
                        formSignUp.setFields([{ name: 'building_type', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveBuildingType(item.id);
                        setShowBuildingType(false);
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
                  setShowBuildingType(true);
                }}
              >
                <Form.Item name={'building_type'} rules={[{ required: true, message: '建物種別を入力してください' }]}>
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    placeholder="建物種別"
                    className="input-global"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/* ---------------------- CAPACITY_M -------------------- */}

              <Modal
                footer={false}
                open={showCapacityM}
                onCancel={(): void => {
                  setShowCapacityM(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
              >
                {CapacityMItems?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('capacity_m', item.title);
                        formSignUp.setFields([{ name: 'capacity_m', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveCapacityM(item.id);
                        setShowCapacityM(false);
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
                  setShowCapacityM(true);
                }}
              >
                <Form.Item name={'capacity_m'} rules={[{ required: true, message: 'お家の広さを入力してください' }]}>
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    placeholder="お家の広さ"
                    className="input-global"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/* ---------------------- CAPACITY_K -------------------- */}

              <Modal
                footer={false}
                open={showCapacityK}
                onCancel={(): void => {
                  setShowCapacityK(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
              >
                {CapacityKItems?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('capacity_k', item.title);
                        formSignUp.setFields([{ name: 'capacity_k', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveCapacityK(item.id);
                        setShowCapacityK(false);
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
                  setShowCapacityK(true);
                }}
              >
                <Form.Item name={'capacity_k'} rules={[{ required: true, message: '間取りを入力してください' }]}>
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    placeholder="間取り"
                    className="input-global"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              {/*------------------BUILDING-HEIGHT------------*/}

              <Modal
                footer={false}
                open={showBuildingHeight}
                onCancel={(): void => {
                  setShowBuildingHeight(false);
                }}
                closeIcon={
                  <>
                    <img src={image.iconClose} alt="" />
                  </>
                }
                title={
                  <div>
                    <h2 className="head-modal-title">下記から選択してください</h2>
                  </div>
                }
              >
                {buildingHeightItems?.map((item: any) => {
                  return (
                    <p
                      key={item.id}
                      onClick={(): void => {
                        formSignUp.setFieldValue('building_height', item.title);
                        formSignUp.setFields([{ name: 'building_height', errors: undefined }]);
                        handleCheckModalValue();
                        setSaveBuildingHeight(item.id);
                        setShowBuildingHeight(false);
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
                  setShowBuildingHeight(true);
                }}
              >
                <Form.Item name={'building_height'} rules={[{ required: true, message: '何階建てを選択してください' }]}>
                  <Input
                    type="text"
                    maxLength={0}
                    readOnly={true}
                    placeholder="階数"
                    className="input-global"
                    suffix={<CaretDownOutlined className="icon-dropdown" />}
                    addonBefore={<>*</>}
                  />
                </Form.Item>
              </div>

              <div className="form-group form-group-bottom form-group-textarea">
                <Form.Item name={'description'} label={'備考'}>
                  <Input.TextArea
                    className="input-global"
                    placeholder="例）玄関にチャイムがついていません。
到着しましたら、携帯に連絡をお願いします"
                  />
                </Form.Item>
              </div>
              <div className="btn-signup-bottom">
                {isEdit ? (
                  <div className="btn-cast-edit">
                    <button
                      className="btn btn-check"
                      onClick={(): void => {
                        if (isEdit) {
                          if (getLocalStorage('isOnlyRevise')) {
                            navigate(config.routes.customerInformation);
                            localStorage.removeItem('isOnlyRevise');
                          } else {
                            navigate(config.routes.detailCustomer);
                          }
                        } else {
                          navigate(config.routes.customerInformation);
                        }
                      }}
                    >
                      戻る
                    </button>
                    <button className={`btn ${!statusEmpty ? ' not-allowed' : ' cr-allow'}`} type="submit">
                      次へ
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type={!statusEmpty ? 'button' : 'submit'}
                      // onClick={() => {
                      //   if (!statusEmpty) {
                      //     return onSubmit;
                      //   }
                      // }}
                      className={`btn ${!statusEmpty ? ' not-allowed' : ' cr-allow'}`}
                    >
                      決済情報入力へ
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

export default CustomerSignUp;
