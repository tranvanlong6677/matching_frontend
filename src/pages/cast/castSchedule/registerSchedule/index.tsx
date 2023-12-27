import { Dispatch } from 'redux';
import { isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, notification, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteCastService,
  getAllJob,
  getJobById,
  resetHourIdActiveMatching,
} from '../../../../redux/services/castSlice';
import { repeatSettingItems } from '../../../../utils/repeatSettingItems';
import { castHourArrayItems } from '../../../../utils/castHourArrayItems';
import { alertFail, alertSuccess } from '../../../../helper/common';
import CheckboxCustom from '../../../../components/checkboxCustom';
import image, { images } from '../../../../assets/images/index';
import recycleImage from '../../../../assets/images/png/recycle.png';
import { useDate } from '../../../../hooks/useDate';
import { castApi } from '../../../../api';
import config from '../../../../config';

const hourOptions: any = [
  {
    id: 1,
    title: 'AMを選択',
    active: false,
  },
  {
    id: 2,
    title: 'PMを選択',
    active: false,
  },
  {
    id: 3,
    title: 'All Time',
    active: false,
  },
];

const hourOptionRules: any = [
  {
    start_time: 1,
    end_time: 4,
  },
  {
    start_time: 5,
    end_time: 11,
  },
  {
    start_time: 1,
    end_time: 11,
  },
];

const monthNow: number = new Date().getMonth();

const RegisterSchedule = () => {
  const dispatch: Dispatch = useDispatch();
  const dateStart: Date = useDate('start');
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [value, setValue]: [any, React.Dispatch<any>] = useState<any>(null);
  const [loading, setLoading]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [checkEdit, setCheckEdit]: [boolean, React.Dispatch<any>] = useState<any>(false);
  const [repeatSetting, setRepeatSetting]: [any, React.Dispatch<any>] = useState<any>(null);
  const [showShift, setShowShift]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [hourArray, setHourArray]: [any, React.Dispatch<any>] = useState<any>(castHourArrayItems);
  const [showCloseIcon, setShowCloseIcon]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [montbCalendar, setMonthCalendar]: [number, React.Dispatch<any>] = useState<number>(monthNow);
  const [hourArrayOption, setHourArrayOption]: [any, React.Dispatch<any>] = useState<any>(hourOptions);
  const [checkDisableRepeat, setCheckDisableRepeat]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete]: [boolean, React.Dispatch<any>] = useState<boolean>(false);

  // REDUCER
  const { castJobActive, castJobById, castJobs, hourIdActive, hourIdActiveMatching } = useSelector(
    (state: any) => state.castReducer,
  );

  // HOOK EFFECT
  useEffect((): void => {
    dispatch(getAllJob());
  }, [dispatch]);

  useEffect((): void => {
    if (castJobById.status === 'success') {
      const tmpHourArray = hourArray?.map((item: any): any => {
        const idActiveNotMatching = hourIdActive?.find((castItem: any): boolean => castItem === item.id);
        const idActiveMatching = hourIdActiveMatching?.find((castItem: any): boolean => castItem === item.id);
        if (idActiveNotMatching) {
          return {
            ...item,
            active: true,
            matchingStatus: false,
          };
        } else if (idActiveMatching) {
          return {
            ...item,
            active: true,
            matchingStatus: true,
          };
        } else {
          return {
            ...item,
            active: false,
            matchingStatus: false,
          };
        }
      });
      setHourArray(tmpHourArray);
      setRepeatSetting(castJobById?.data[0]?.repeat_setting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castJobById]);

  // HANDLE ONCHANGE
  const onChange = (values: any): void => {
    if (!isSameDay(values, value)) {
      setValue(values);
      const filterCheckEdit = castJobs?.data?.filter((item: any) => isSameDay(new Date(item.date), values));
      const dateConvert: Date = new Date(values);
      if (filterCheckEdit?.length !== 0 && filterCheckEdit !== undefined) {
        setCheckEdit(true);
        dispatch(
          getJobById({ date: `${dateConvert.getFullYear()}-${dateConvert.getMonth() + 1}-${dateConvert.getDate()}` }),
        );
        setCheckDisableRepeat(true);
      } else {
        const tmpHour = hourArray?.map((item: any) => {
          return {
            ...item,
            active: false,
            matchingStatus: false,
          };
        });

        setHourArray(tmpHour);
        setCheckEdit(false);
        setRepeatSetting(null);
        setCheckDisableRepeat(false);
        dispatch(resetHourIdActiveMatching());
      }
      setHourArrayOption(hourOptions);
    } else {
      setValue(null);
      setShowShift(false);
      setCheckEdit(false);
      setHourArrayOption(hourOptions);
    }
  };

  const date: Date = new Date(value);

  // CALENDAR SETTINGS
  const calendarSettings: any = {
    locale: 'ja',
    calendarType: 'US',
    next2Label: null,
    prev2Label: null,
    prevLabel: (
      <>
        <img src={image.iconArrowLeft} className="arrow-calendar" alt="" />
      </>
    ),
    nextLabel: (
      <>
        <img src={image.iconArrowRight} className="arrow-calendar" alt="" />
      </>
    ),
  };

  const selectedDate: string =
    date.getFullYear() + '年' + (date.getMonth() + 1) + '月'.slice(-2) + date.getDate() + '日'.slice(-2) + '（木)';

  // RESET DATA
  const resetData = (): void => {
    const tmpHourArray = hourArray?.map((hourItem: any) => {
      return {
        ...hourItem,
        active: false,
        matchingStatus: false,
      };
    });
    setHourArray(tmpHourArray);
    setHourArrayOption(hourOptions);
    setRepeatSetting(null);
  };

  // CHECK TIME
  const checkTimeSubmit = (arr: any) => {
    const result: any = [];
    let tempArray: any = [arr[0]];

    for (let i: number = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1] + 1) {
        tempArray.push(arr[i]);
      } else {
        result.push(tempArray);
        tempArray = [arr[i]];
      }
    }
    result.push(tempArray);
    return result;
  };

  // CHECK DATA SUBMIT
  const checkDataSubmit = (result: any) => {
    let check: boolean = true;
    for (let i: number = 0; i < result.length; i++) {
      if (result[i].length === 1) {
        check = false;
        break;
      }
    }
    return check;
  };

  // HANDLE SUBMIT DATA
  const handleSubmit = async (): Promise<void> => {
    // FILTER ALL TIME ACTIVE
    const filterValue = hourArray?.filter((hourItem: any): boolean => hourItem.active === true);

    // FILTER TIME ACTIVE MATCHED
    const filterValueMatching = hourArray?.filter(
      (hourItem: any): boolean => hourItem.active === true && hourItem?.matchingStatus === true,
    );

    // FILTER TIME ACTIVE NOT MATCHING
    const filterValueNotMatching = hourArray?.filter(
      (hourItem: any): boolean => hourItem.active === true && hourItem?.matchingStatus === false,
    );

    // GET ALL ID TIME ACTIVE
    let idFilterValue: number[] = [];
    for (const filterValueKey of filterValue) {
      idFilterValue.push(filterValueKey.id);
    }

    // GET ID TIME NOT MATCHING
    let idFilterValueNotMatching: number[] = [];
    for (const filterValueKey of filterValueNotMatching) {
      idFilterValueNotMatching.push(filterValueKey.id);
    }

    // GET ID TIME MATCHING
    let idFilterValueMatching: number[] = [];
    for (const filterValueKey of filterValueMatching) {
      idFilterValueMatching.push(filterValueKey.id);
    }

    // CHECK ID TIME SUBMIT
    const resultDataSubmit: any = checkTimeSubmit(idFilterValue);
    const resultDataMatching: any = checkTimeSubmit(idFilterValueMatching);
    const resultDataNotMatching: any = checkTimeSubmit(idFilterValueNotMatching);

    // GET END TIME JOB MATCHING
    const endTimeJobMatching = resultDataMatching?.map((item: any) => {
      return item[item.length - 1];
    });

    // GET START TIME JOB MATCHING
    const startTimeJobMatching = resultDataMatching?.map((item: any) => {
      return item[0];
    });

    let isCorrectTime: boolean = false;

    // CHECK TIME UPDATE
    resultDataNotMatching?.forEach((element: any): void => {
      if (endTimeJobMatching?.includes(element[0] - 1)) {
        isCorrectTime = true;
      }
      if (startTimeJobMatching?.includes(element[element?.length - 1] + 1)) {
        isCorrectTime = true;
      }
    });

    if (checkDataSubmit(resultDataSubmit) && !isCorrectTime) {
      const year: number = date.getFullYear();
      const month: string | number = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const day: string | number = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const dateSubmit: string = `${year}-${month}-${day}`;
      const hourSubmit: any = resultDataSubmit?.map((item: any): any => {
        return {
          start_time: item[0],
          end_time: item[item.length - 1],
        };
      });

      const submitData: any = {
        date: dateSubmit,
        array_hour: hourSubmit,
        repeat_setting: repeatSetting !== null ? repeatSetting : undefined,
      };

      try {
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
          alertFail(api, 'Fail');
        } else {
          setLoading(true);
          const res: any = await castApi.registerSchedule(submitData);
          if (res.status === 'success') {
            alertSuccess(api, 'Success');
            resetData();
            navigate(config.routes.castScheduleSuccess);
            setLoading(false);
          }
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    } else {
      alertFail(api, 'Fail');
    }
  };

  // HANDLE CALENDAR
  const handleClassname = ({ date, view }: any): string | undefined => {
    let className: string = '';
    if (view === 'month') {
      if (date.getMonth() !== montbCalendar) {
        className = 'day-not-month';
      }
      if (
        castJobActive?.find((dDate: any) => isSameDay(dDate, date) && dDate > dateStart) &&
        date.getMonth() === montbCalendar
      ) {
        className = 'selected-day';
        const sameDayInCastJob = castJobs?.data?.filter((castJobItem: any) =>
          isSameDay(new Date(castJobItem?.date), date),
        );

        const findDayNotMatching = sameDayInCastJob?.filter((dayItem: any): boolean => dayItem?.status_matching === 0);
        const findDayMatching = sameDayInCastJob?.filter((dayItem: any): boolean => dayItem?.status_matching === 1);

        //  first: have matching and not matching
        //  second: all matching
        //  third: matching full

        if (findDayNotMatching?.length !== 0 && findDayMatching?.length !== 0) {
          className += ' first';
        }

        if (findDayMatching?.length === 0 && findDayNotMatching?.length !== 0) {
          className += ' second';
        }

        if (findDayMatching?.length !== 0 && findDayNotMatching?.length === 0) {
          className += ' third';
        }
      }
    }
    return className;
  };

  const tileDisabled = ({ date, view }: any): boolean | undefined => {
    const dateNow: Date = new Date();

    if (view === 'month') {
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(dateNow.getMonth() + 5);
      if (
        (date.getFullYear() === dateNow.getFullYear() && date.getMonth() < dateNow.getMonth()) ||
        (date.getFullYear() === dateNow.getFullYear() &&
          date.getMonth() === dateNow.getMonth() &&
          date.getDate() < dateNow.getDate()) ||
        (date.getFullYear() === sixMonthsFromNow.getFullYear() && date.getMonth() > sixMonthsFromNow.getMonth()) ||
        date.getFullYear() > sixMonthsFromNow.getFullYear()
      ) {
        return true;
      }
    }
  };

  const handleSchedule = (item: any): void => {
    const tmpData = hourArray?.map((hourItem: any): any => {
      if (hourItem.id === item.id) {
        return {
          ...item,
          active: !hourItem.active,
        };
      } else {
        return {
          ...hourItem,
        };
      }
    });
    setHourArray(tmpData);
  };

  // HANDLE REPEAT SETTING
  const handleRepeatSetting = (value: any): void => {
    setRepeatSetting(value);
  };

  const checkSubmitStatus: boolean = useMemo(() => {
    let check: boolean = true;
    const filterValue = hourArray?.filter((hourItem: any): boolean => hourItem.active === true);
    let idFilterValue: number[] = [];
    for (const filterValueKey of filterValue) {
      idFilterValue.push(filterValueKey.id);
    }
    const resultDataSubmit: any = checkTimeSubmit(idFilterValue);
    if (!checkDataSubmit(resultDataSubmit)) {
      check = false;
    }
    return check;
  }, [hourArray]);

  const handleDeleteService = async (): Promise<void> => {
    // CHECK DATE DELETE
    const filterCheckEdit = await castJobs?.data?.filter((item: any) => isSameDay(new Date(item.date), value));

    // GET LIST BUTTON ACTIVE BUT NOT MATCHING
    const listBtnActiveNotMatching = await hourArray?.filter(
      (hourItem: any) => hourItem.active && !hourItem.matchingStatus,
    );

    // CHECK DATE SCHEDULE AND HAVE BUTTON NOT MATCHING
    if (filterCheckEdit?.length >= 1 && listBtnActiveNotMatching?.length > 0) {
      const res = await dispatch(deleteCastService(filterCheckEdit[0]?.id));
      if (res?.payload?.status === 'success') {
        navigate(config.routes.castScheduleSuccess);
      } else {
        alertFail(api, 'Fail');
      }
    } else {
      alertFail(api, 'Fail');
    }
  };

  // HANDLE HOUR OPTION
  const handleHourOption = (hourOption: any): void => {
    const tmpHourOption = hourArrayOption?.map((hourItem: any): any => {
      if (hourItem.id === hourOption.id) {
        return {
          ...hourItem,
          active: !hourItem.active,
        };
      } else {
        return {
          ...hourItem,
          active: false,
        };
      }
    });
    setHourArrayOption(tmpHourOption);
    handleTimeSchedule(hourOption);
  };

  // HANDLE TIME WHEN CLICK HOUR OPTIONS
  const handleTimeSchedule = useCallback(
    (hourOption: any): void => {
      const checkHourOptionActive = hourArrayOption?.find((item: any): boolean => hourOption.id === item.id);

      if (!checkHourOptionActive?.active) {
        const tmpHourArray = hourArray?.map((hourItem: any): any => {
          if (
            hourItem.id < hourOptionRules[checkHourOptionActive.id - 1]?.start_time ||
            hourItem.id > hourOptionRules[checkHourOptionActive.id - 1]?.end_time
          ) {
            return {
              ...hourItem,
              active: false,
            };
          } else {
            return {
              ...hourItem,
              active: true,
            };
          }
        });
        setHourArray(tmpHourArray);
      } else {
        setHourArray(castHourArrayItems);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hourArrayOption],
  );

  return (
    <>
      {showPopup}
      <Spin spinning={loading}>
        <div className="block-calendar container-680">
          <div className="content">
            <div className="menu-content">
              <div className="head-title">
                <div className="head-calendar">
                  <div className="icon">
                    <img src={image.iconCalendarCast} alt="Error" />
                  </div>
                  <h2 className="item-title">シフト登録・変更・削除</h2>
                </div>
              </div>
              <div className="item-des">
                <p className="calendar-description">
                  シフト登録が完了している日付は青色で表示されます。
                  <br />
                  日付をタップするとシフトの変更や、登録時間を確認できます。
                  <br />
                  シフトを削除したい場合は登録した日付をタップし、
                  <br />
                  「シフトをクリアボタン」から「確定」ボタンを押してください。
                </p>
                <div className="calendar-content">
                  <Calendar
                    value={value}
                    onChange={onChange}
                    {...calendarSettings}
                    tileDisabled={tileDisabled}
                    onActiveStartDateChange={(value: any) => {
                      const month = new Date(value?.activeStartDate).getMonth();
                      setMonthCalendar(month);
                    }}
                    tileClassName={handleClassname}
                    formatDay={(_: string | undefined, date: Date): number | string => {
                      const tmpMonthCalendar: number = new Date(date).getMonth();
                      if (montbCalendar === tmpMonthCalendar) {
                        return date.getDate();
                      }
                      return '';
                    }}
                  />

                  {showShift ? (
                    <>
                      <div className="item-selected">
                        <button className="btn-date">{value === '' ? '' : selectedDate}</button>
                        <div className="item-hour-line">
                          <div className="note-calendar">
                            <p>
                              {`※シフトは2時間以上連続するように選択ください`} <br />
                              {`※移動時間は考慮せず、登録時間を選択してください。`}
                            </p>
                          </div>
                          <div className="list-hour">
                            {hourArray?.map((item: any, index: any) => {
                              return (
                                <div
                                  key={index}
                                  className={`btn-hour-wrapper${item?.matchingStatus ? ' matched' : ''}`}
                                >
                                  <button
                                    onClick={(): void => handleSchedule(item)}
                                    key={item.id}
                                    className={`btn-hour${item.active ? ' btn-hour-active' : ''}${
                                      item.blocked ? ' not-allowed' : ''
                                    }`}
                                  >
                                    {item.title}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <div className="type-hour-item">
                            {hourArrayOption?.map((hourOption: any) => {
                              return (
                                <button
                                  className={`btn-type-hour${hourOption?.active ? ' active' : ''}`}
                                  key={hourOption?.id}
                                  onClick={() => handleHourOption(hourOption)}
                                >
                                  {hourOption?.title}
                                </button>
                              );
                            })}
                          </div>
                          <div className="check-hour ts-1">
                            <span>繰り返し設定</span>

                            <div className="checkbox-confirm">
                              <CheckboxCustom
                                options={repeatSettingItems}
                                onChange={handleRepeatSetting}
                                value={repeatSetting}
                                disabled={
                                  value !== null &&
                                  castJobById?.data !== undefined &&
                                  !!castJobById?.data[0]?.repeat_setting &&
                                  checkDisableRepeat
                                    ? true
                                    : false
                                }
                                horizontal
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
                <div className="block-calendar-btn">
                  {showShift ? (
                    <button
                      className="btn"
                      onClick={(): void => {
                        if (checkEdit) {
                          setShowModalDelete(true);
                        } else {
                          resetData();
                        }
                      }}
                    >
                      シフトをクリア
                    </button>
                  ) : (
                    <button
                      className="btn btn-check"
                      onClick={(): void => {
                        navigate(config.routes.castDashboard);
                      }}
                    >
                      戻る
                    </button>
                  )}

                  {showShift ? (
                    <button
                      className={`btn${value !== null && checkSubmitStatus ? ' ct-allow' : ' not-allowed'}`}
                      onClick={handleSubmit}
                    >
                      確定
                    </button>
                  ) : (
                    <button
                      className="btn ct-allow"
                      onClick={(): void => {
                        if (value !== '' && value !== null) {
                          setShowShift(true);
                          setShowCloseIcon(true);
                        } else {
                          setShowCloseIcon(false);
                          alertFail(api, '日付を選択してください。');
                        }
                      }}
                    >
                      シフト情報を登録する
                    </button>
                  )}
                </div>
                {showCloseIcon ? (
                  <div
                    className="close-icon "
                    onClick={(): void => {
                      navigate(config.routes.castDashboard);
                    }}
                  >
                    <img src={images.iconSchedule} alt="Error" width={30} />
                    <span>閉じる</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </Spin>
      <Modal
        open={showModalDelete}
        footer={false}
        closable={false}
        className="modal-delete-cast"
        onCancel={() => {
          setShowModalDelete(false);
        }}
      >
        <div className="modal-delete-wrap">
          <img src={recycleImage} alt="Error" />
          <span className="text-delete">このシフトを取り消しますか？</span>
          <div className="delete-actions">
            <button
              className="btn-cancel"
              onClick={() => {
                setShowModalDelete(false);
              }}
            >
              いいえ
            </button>
            <button className="btn-delete" onClick={handleDeleteService}>
              はい
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RegisterSchedule;
