import { Dispatch } from 'redux';
import { addDays, isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import { Modal, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

import { alertFail, getDateAfterTwoWeeks, getLocalStorage, setLocalStorage } from '../../../../../helper/common';
import arrowRight from '../../../../../assets/images/mockup/arrow-calendar-right.svg';
import arrowLeft from '../../../../../assets/images/mockup/arrow-calendar-left.svg';
import { repeatSettingItems } from '../../../../../utils/repeatSettingItems';
import { hourScheduleCustomer } from '../../../../../utils/hourSchedule';
import CheckboxCustom from '../../../../../components/checkboxCustom';
import { dayItems } from '../../../../../utils/dayItems';
import { useDate } from '../../../../../hooks/useDate';
import {
  getAllShiftCast,
  getCurrentShift,
  getShiftCastById,
  resetDateShiftCast,
  resetShitCastById,
} from '../../../../../redux/services/castSlice';
import { customerApi } from '../../../../../api/customerApi/customerApi';
import { checkShiftRegister } from '../../../../../redux/services/customerSlice';

const CalendarModal = ({
  showCalendarModal,
  setShowCalendarModal,
  chooseCast = null,
  handleSetDateTime = (): void => {},
  setCheckDatetimeData = (): void => {},
  modalBookingSoji = false,
}: any) => {
  const dispatch: Dispatch = useDispatch();
  const { id }: any = useParams();
  const [api, showPopup]: any = notification.useNotification();
  const monthNow: number = new Date().getMonth();
  const yearNow: number = new Date().getFullYear();
  // HOOK STATE
  const [value, setValue]: [any, React.Dispatch<any>] = useState<any>(null);
  const [saveHour, setSaveHour]: [any, React.Dispatch<any>] = useState<any>(null);
  const [displayDate, setDisplayDate]: [any, React.Dispatch<any>] = useState<any>();
  const [saveDayId, setSaveDayId]: [any, React.Dispatch<any>] = useState<any>(null);
  const [checkDateEmpty, setCheckDateEmpty]: [any, React.Dispatch<any>] = useState<any>(false);
  const [saveRepeatSetting, setSaveRepeatSetting]: [any, React.Dispatch<any>] = useState<any>(null);
  const [hourArray, setHourArray]: [any, React.Dispatch<any>] = useState<any>(hourScheduleCustomer);
  const [disableTimeDefault, setDisableTimeDefault]: [any, React.Dispatch<any>] = useState<any>([]);
  const [montbCalendar, setMonthCalendar]: [number, React.Dispatch<any>] = useState<number>(monthNow);
  const [yearCalendar, setYearCalendar]: any = useState<number>(yearNow);

  const { listShiftCast, listDateShiftCast, castShiftById, castShiftActiveId, castShiftActiveIdForUpdate } =
    useSelector((state: any) => state.castReducer);
  const { shiftRegister } = useSelector((state: any) => state.customerReducer);

  // GET DATA LOCALSTORAGE

  const castData = getLocalStorage('cast');
  const scheduleData: any = getLocalStorage('cse');
  const dateStart: Date = useDate('start');

  // GET DAY AFTER TOO WEEK AND 3DAYS
  const dateNow: Date = new Date();

  const after3days: Date = new Date(addDays(dateNow, 2).setHours(23, 59, 59, 999));
  const dateAfterTwoWeeks: Date = getDateAfterTwoWeeks();
  useEffect((): void => {
    if (chooseCast !== 'none' && chooseCast !== null) {
      dispatch(getAllShiftCast({ user_id: chooseCast }));
    }
    if (chooseCast === 'none') {
      dispatch(getCurrentShift());
    }
    if (chooseCast === null) {
      dispatch(resetDateShiftCast());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseCast]);

  useEffect((): void => {
    if (castData !== null && castData?.user_id !== 'none') {
      const findExist = listShiftCast?.find((item: any) => isSameDay(new Date(item?.date), value));
      if (findExist) {
        const updateDay = getLocalStorage('udd');
        if (castShiftById?.length !== 0 && id && isSameDay(new Date(findExist?.date), new Date(updateDay?.date))) {
          const tmpHourArray: any[] = hourScheduleCustomer?.map((item: any) => {
            const checkHourIdActive = castShiftActiveIdForUpdate?.find((castItem: any) => castItem === item?.id);

            // Set button hour id active
            if (checkHourIdActive) {
              return {
                ...item,
                block: false,
                date_status: true,
              };
            } else {
              return {
                ...item,
                block: true,
                date_status: true,
              };
            }
          });

          // SET HOUR ARRAY WHEN CHANGE DAY
          setHourArray(tmpHourArray);
        } else {
          let tmpCastShiftActiveIdForUpdate: any = [];
          shiftRegister?.data?.forEach((item: any): void => {
            for (let i = item.start_time; i <= item.end_time; i++) {
              tmpCastShiftActiveIdForUpdate.push(i);
            }
          });

          const listIdCanActive: any = _.difference(castShiftActiveId, tmpCastShiftActiveIdForUpdate);

          const tmpHourArray: any[] = hourScheduleCustomer?.map((item: any): any => {
            const checkHourIdActive = listIdCanActive?.find((castItem: any): boolean => castItem === item?.id);

            // Set button hour id active
            if (checkHourIdActive) {
              return {
                ...item,
                block: false,
                date_status: true,
              };
            } else {
              return {
                ...item,
                block: true,
                date_status: true,
              };
            }
          });
          setHourArray(tmpHourArray);
        }
      } else {
        let tmpCastShiftActiveIdForUpdate: any = [];
        shiftRegister?.data?.forEach((item: any): void => {
          for (let i = item.start_time; i <= item.end_time; i++) {
            tmpCastShiftActiveIdForUpdate.push(i);
          }
        });

        const tmpHourArray: any[] = hourScheduleCustomer?.map((item: any): any => {
          const checkHourIdActive = tmpCastShiftActiveIdForUpdate?.find(
            (castItem: any): boolean => castItem === item?.id,
          );

          // Set button hour id active
          if (!checkHourIdActive) {
            return {
              ...item,
              block: false,
              date_status: true,
            };
          } else {
            return {
              ...item,
              block: true,
              date_status: true,
            };
          }
        });
        setHourArray(tmpHourArray);
        setSaveDayId(null);
      }
    }

    // NOT CHOOSE CAST
    if (castData !== null && castData?.user_id === 'none') {
      let tmpCastShiftActiveIdForUpdate: any = [];
      shiftRegister?.data?.forEach((item: any): void => {
        for (let i = item.start_time; i <= item.end_time; i++) {
          tmpCastShiftActiveIdForUpdate.push(i);
        }
      });

      const tmpHourArray: any[] = hourScheduleCustomer?.map((item: any): any => {
        const checkHourIdActive = tmpCastShiftActiveIdForUpdate?.find(
          (castItem: any): boolean => castItem === item?.id,
        );

        // Set button hour id active
        if (!checkHourIdActive) {
          return {
            ...item,
            block: false,
            date_status: true,
          };
        } else {
          return {
            ...item,
            block: true,
            date_status: true,
          };
        }
      });
      setHourArray(tmpHourArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castShiftById, saveDayId, checkDateEmpty, shiftRegister]);

  useEffect((): void => {
    if (chooseCast !== 'none') {
      if (saveDayId !== null) {
        const dateConvert: Date = new Date(value);
        const month: string =
          dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : `${dateConvert.getMonth() + 1}`;
        const day: string = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : `${dateConvert.getDate()}`;
        dispatch(
          getShiftCastById({
            user_id: chooseCast,
            date: `${dateConvert.getFullYear()}-${month}-${day}`,
          }),
        );
        setSaveHour(null);
        setSaveRepeatSetting(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveDayId]);

  const onChange = (value: any): void => {
    const dateNow: Date = new Date();
    const valueConvert: Date = new Date(value);
    const tmpDateString: string = `${valueConvert?.getFullYear()}年${
      valueConvert?.getMonth() + 1
    }月${valueConvert?.getDate()}日（${dayItems[valueConvert?.getDay()]}）`;

    const tmpListShiftCast = listShiftCast?.find(
      (dDate: any) => isSameDay(new Date(dDate.date), value) && value.getMonth() < dateNow.getMonth() + 2,
    );

    if (tmpListShiftCast !== undefined) {
      setSaveDayId(tmpListShiftCast?.id);
      if (castData?.user_id === 'none') {
        dispatch(resetShitCastById());
      }
      dispatch(
        checkShiftRegister({
          date: `${valueConvert.getFullYear()}-${valueConvert.getMonth() + 1}-${valueConvert.getDate()}`,
        }),
      );
    } else {
      const tmpHourArray = hourArray?.map((hour: any) => {
        return {
          ...hour,
          block: false,
          date_status: true,
        };
      });
      setHourArray(tmpHourArray);
      dispatch(resetShitCastById());
      dispatch(
        checkShiftRegister({
          date: `${valueConvert.getFullYear()}-${valueConvert.getMonth() + 1}-${valueConvert.getDate()}`,
        }),
      );
    }

    setCheckDateEmpty(!checkDateEmpty);
    setDisableTimeDefault([]);
    setDisplayDate(tmpDateString);
    setValue(value);
  };

  // HANDLE CALENDAR
  const calendarSettings: any = {
    locale: 'ja',
    calendarType: 'US',
    next2Label: null,
    prev2Label: null,
    prevLabel:
      montbCalendar === monthNow && yearCalendar === yearNow && modalBookingSoji ? null : (
        <>
          <img src={arrowLeft} className="arrow-calendar" alt="Error" />
        </>
      ),

    nextLabel: (
      <>
        <img src={arrowRight} className="arrow-calendar" alt="Error" />
      </>
    ),
  };

  const handleClassname = ({ date, view }: any) => {
    const monthNow: number = new Date().getMonth() + 1;
    let className: string = '';
    let checkUpdateDay: boolean = true;

    if (view === 'month') {
      if (date.getMonth() !== montbCalendar) {
        className = 'day-not-month';
      }
      if (
        listDateShiftCast?.find(
          (dDate: any) =>
            isSameDay(dDate, date) && dDate > dateStart && dDate.getMonth() + 1 < monthNow + 2 && dDate > after3days,
        ) &&
        date.getMonth() === montbCalendar
      ) {
        className = 'selected-day';
        const findMatchingDay = listShiftCast
          ?.filter((item: any) => isSameDay(new Date(item?.date), date))
          ?.find((item: any): boolean => item.status_matching === 0);

        if (id) {
          const updateDayData = getLocalStorage('udd');
          if (isSameDay(new Date(updateDayData?.date), date)) {
            checkUpdateDay = false;
          }
        }

        if (castData?.user_id !== 'none' && !findMatchingDay && checkUpdateDay) {
          className += ' m-d';
        }
      }
    }
    return className;
  };

  const tileDisabled = ({ date, view }: any): boolean | undefined => {
    const dateNow: Date = new Date();
    let checkUpdateDay: boolean = true;

    const checkExistInListShift = listShiftCast?.find((item: any) => isSameDay(new Date(item.date), date));
    // check day exist in calendar and not matching full day
    const findDayNotMatching = listShiftCast?.find(
      (item: any): boolean =>
        item?.status_matching === 0 && isSameDay(new Date(item?.date), date) && new Date(item?.date) > after3days,
    );

    // Check day matching full
    const checkDayMatchingFull = listShiftCast
      ?.filter((item: any) => isSameDay(new Date(item?.date), date))
      ?.every((itemFil: any): boolean => itemFil.status_matching === 1);

    if (id) {
      const updateDayData = getLocalStorage('udd');
      if (isSameDay(new Date(updateDayData?.date), date)) {
        checkUpdateDay = false;
      }
    }

    if (castData?.user_id !== 'none') {
      if (
        !!(
          isSameDay(date, dateNow) ||
          date.getMonth() < dateNow.getMonth() ||
          date.getFullYear() !== dateNow.getFullYear() ||
          (!findDayNotMatching && date < dateAfterTwoWeeks && checkUpdateDay) ||
          (date.getMonth() === dateNow.getMonth() && date.getDate() < dateNow.getDate()) ||
          date.getMonth() > dateNow.getMonth() + 1 ||
          (checkDayMatchingFull && !!checkExistInListShift && checkUpdateDay)
        ) //check matching full and after two weeks
      ) {
        return true;
      }
    }
    if (castData?.user_id === 'none') {
      // FIND DAY MATCHING
      const findDayCanMatching = listShiftCast?.find(
        (item: any) => isSameDay(new Date(item?.date), date) && new Date(item?.date) > after3days,
      );

      if (
        view === 'month' &&
        (date.getFullYear() !== dateNow.getFullYear() ||
          date.getMonth() < dateNow.getMonth() ||
          date.getMonth() > dateNow.getMonth() + 1 ||
          (date.getMonth() === dateNow.getMonth() && date.getDate() < dateNow.getDate()) ||
          isSameDay(date, dateNow) ||
          (date < dateAfterTwoWeeks && !findDayCanMatching))
      ) {
        return true;
      }
    }
  };

  const handleSchedule = (item: any): void => {
    const tmpHourArray = hourArray?.map((hourItem: any): any => {
      if (hourItem?.block === false) {
        if (hourItem?.id === item.id) {
          return {
            ...hourItem,
            active: true,
          };
        } else {
          return {
            ...hourItem,
            active: false,
          };
        }
      } else {
        return { ...hourItem };
      }
    });
    setHourArray(tmpHourArray);
    handleDisabledTimeDefault(item);
  };

  const handleDisabledTimeDefault = (hourActive: any): void => {
    // Check cast shift exist active hour
    const checkCastShift = castShiftById?.data?.find((item: any) => {
      return item.start_time <= hourActive.id && item?.end_time >= hourActive.id;
    });

    if (castShiftById?.data?.length !== 0 && castShiftById?.length !== 0) {
      if (checkCastShift?.end_time - hourActive.id === 1) {
        setDisableTimeDefault([2]);
        if (saveHour === 2) {
          setSaveHour(null);
        }
      } else if (checkCastShift?.end_time - hourActive.id >= 2) {
        setDisableTimeDefault([]);
      } else {
        setDisableTimeDefault([1, 2]);
        setSaveHour(null);
      }
    }
  };

  const resetData = (): void => {
    setValue(null);
    const tmpHourData = hourArray?.map((item: any) => {
      return {
        ...item,
        active: false,
        block: false,
      };
    });
    setHourArray(tmpHourData);
    setSaveHour(null);
    setSaveRepeatSetting(null);
    setHourArray(hourScheduleCustomer);
    setCheckDatetimeData(false);
    setShowCalendarModal(false);
  };

  const onSubmit = async (): Promise<void> => {
    if (value !== null && checkSubmitStatus && saveHour !== null) {
      const filterHour = hourArray?.filter((item: any): boolean => item.active === true);
      const dateConvert: Date = new Date(value);
      const month: string | number =
        dateConvert.getMonth() + 1 < 10 ? `0${dateConvert.getMonth() + 1}` : dateConvert.getMonth() + 1;
      const day: string | number = dateConvert.getDate() < 10 ? `0${dateConvert.getDate()}` : dateConvert.getDate();

      const dataCheckMatchingExist: any = {
        date: `${dateConvert.getFullYear()}-${month}-${day}`,
        start_time: filterHour[0]?.id,
        end_time: saveHour !== null && saveHour === 1 ? filterHour[0]?.id + 1 : filterHour[0]?.id + 2,
      };

      try {
        const res: any = await customerApi.checkMatchingExist(dataCheckMatchingExist);
        if (res?.status === 'success') {
          if (res?.data?.message === 'Not matching') {
            if (value !== null && checkSubmitStatus && saveHour !== null) {
              const dataSubmit: any = {
                ...scheduleData,
                date: value,
                start_date: filterHour[0]?.id,
                end_date: saveHour !== null && saveHour === 1 ? filterHour[0]?.id + 1 : filterHour[0]?.id + 2,
                repeat_setting: saveRepeatSetting,
                hour: saveHour,
                id: saveDayId,
              };
              if (filterHour?.length !== 0 && value !== null && saveHour !== null) {
                setLocalStorage('cse', dataSubmit);
                handleSetDateTime(dataSubmit);
                resetData();
              } else {
                alertFail(api, 'Fail');
              }
            }
          } else {
            alertFail(api, 'Fail');
          }
        }
      } catch (e) {
        alertFail(api, 'Fail');
      }
    }
  };

  const handleCheckboxAnt = (value: any): void => {
    setSaveHour(value);
  };

  const handleRepeatSetting = (value: any): void => {
    setSaveRepeatSetting(value);
  };

  const checkSubmitStatus: boolean = useMemo((): boolean => {
    const filterHour = hourArray.filter((item: any): boolean => item.active === true);
    if (filterHour?.length === 0) {
      return false;
    } else {
      return true;
    }
  }, [hourArray]);

  return (
    <Modal
      open={showCalendarModal}
      onCancel={(): void => {
        resetData();
        setShowCalendarModal(false);
      }}
      footer={false}
      closeIcon={false}
      className="modal-customer-schedule"
      wrapClassName={modalBookingSoji ? 'booking-soji-modal-container' : ''}
    >
      {showPopup}
      <div className={'calendar-block'}>
        <Calendar
          value={value}
          onChange={onChange}
          {...calendarSettings}
          tileDisabled={tileDisabled}
          onActiveStartDateChange={(value: any): void => {
            const month: number = new Date(value?.activeStartDate).getMonth();
            const year: number = new Date(value?.activeStartDate).getFullYear();
            setMonthCalendar(month);
            setYearCalendar(year);
          }}
          tileClassName={handleClassname}
          formatDay={(_: string | undefined, date: Date): number | string => {
            const tmpMonthCalendar: number = new Date(date).getMonth();
            if (montbCalendar === tmpMonthCalendar) {
              return date.getDate();
            }
            return '';
          }}
          navigationLabel={({ date, label, locale, view }): any => {
            if (chooseCast !== null) {
              return `${label} ${chooseCast === 'none' ? '' : '/'} ${chooseCast === 'none' ? '' : castData?.name}`;
            } else {
              return label;
            }
          }}
        />
        <div className="annotate">
          <div className="annotate-item">
            <div className="annotate-square"></div>
            <span>キャスト稼働日</span>
          </div>
          <div className="annotate-item">
            <div className="annotate-square white"></div>
            <span>予約希望受付日</span>
          </div>
        </div>
        <div className="item-selected">
          {value === null ? '' : <button className="btn-date">{value === '' ? '' : displayDate}</button>}
          <span className="item-date">サービス開始時刻を選択</span>
          <div className="item-hour-line">
            <div className="list-hour booking-soji">
              {hourArray.map((item: any) => {
                return (
                  <button
                    onClick={(): void => {
                      if (item?.date_status && item.block === false) {
                        handleSchedule(item);
                      }
                    }}
                    key={item.id}
                    className={`btn-hour${
                      item.date_status ? (item.active ? ' btn-hour-active' : 'disable') : 'disable'
                    }${item.date_status ? (!item.block ? ' enable' : ' disable') : ' disable'}`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
            <div className="check-hour ts-1">
              <div>
                <span className="check-hour-item-modal">依頼時間を選択</span>
                <span className="checkbox-warning"> *必須項目</span>
              </div>

              <div className="checkbox-confirm">
                <CheckboxCustom
                  onChange={handleCheckboxAnt}
                  options={[
                    {
                      label: '2時間',
                      value: 1,
                    },
                    {
                      label: '3時間',
                      value: 2,
                    },
                  ]}
                  value={saveHour}
                  notAllowed={disableTimeDefault}
                  horizontal
                />
              </div>
            </div>
            <div className="check-hour ts-1">
              <span className="check-hour-item">依頼頻度のご要望</span>
              <div className="checkbox-confirm">
                <CheckboxCustom
                  options={repeatSettingItems}
                  onChange={handleRepeatSetting}
                  value={saveRepeatSetting}
                  horizontal
                />
              </div>
            </div>
            <div className="calendar-modal-bottom">
              <span className="calendar-frequency">依頼頻度に関して</span>
              <p id="calendar-frequency-item">
                チェックすると６ヶ月間のスケジュールが登録されます。キャストのシフトが入っていない場合は予約されませんが、シフトが入った段階で自動的に予約が確定されます。その際にキャストを指名することはできません。
              </p>
            </div>
          </div>
        </div>
        <div className="block-modal-calendar">
          <button
            className="btn btn-check"
            onClick={() => {
              setShowCalendarModal(false);
            }}
          >
            閉じる
          </button>
          <button
            className={`btn btn-check${
              value !== null && checkSubmitStatus && saveHour !== null ? ' cr-allow' : ' not-allowed'
            }`}
            onClick={onSubmit}
          >
            確定
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(CalendarModal);
