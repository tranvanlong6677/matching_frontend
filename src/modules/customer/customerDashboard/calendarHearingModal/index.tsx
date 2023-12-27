import { Modal } from 'antd';
import { isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { dayItems } from '../../../../utils/dayItems';
import image from '../../../../assets/images/index';
import { useLocation } from 'react-router-dom';

export const hourArrayItemsHearing = [
  {
    id: 1,
    title: '9:00',
    active: false,
    value: 9,
    blocked: false,
  },
  {
    id: 2,
    title: '10:00',
    active: false,
    value: 10,
    blocked: false,
  },
  {
    id: 3,
    title: '11:00',
    active: false,
    value: 11,
    blocked: false,
  },
  {
    id: 4,
    title: '12:00',
    active: false,
    value: 12,
    blocked: false,
  },
  {
    id: 5,
    title: '13:00',
    active: false,
    value: 13,
    blocked: false,
  },
  {
    id: 6,
    title: '14:00',
    active: false,
    value: 14,
    blocked: false,
  },
  {
    id: 7,
    title: '15:00',
    active: false,
    value: 15,
    blocked: false,
  },
  {
    id: 8,
    title: '16:00',
    active: false,
    value: 16,
    blocked: false,
  },
  {
    id: 9,
    title: '17:00',
    active: false,
    value: 17,
    blocked: false,
  },
  {
    id: 10,
    title: '18:00',
    active: false,
    value: 18,
    blocked: false,
  },
  {
    id: 11,
    title: '19:00',
    active: false,
    value: 19,
    blocked: false,
  },
];

const CalendarHearingModal = ({
  showHearingCalendarModal,
  setShowHearingCalendarModal,
  handleHearingData,
  saveIdHearing,
  hearingData,
  setHearingData,
}: any) => {
  // HOOK STATE
  const [value, setValue] = useState<any>(null);
  const [displayDate, setDisplayDate]: [any, React.Dispatch<any>] = useState<any>();
  const [hourArray, setHourArray] = useState<any>(hourArrayItemsHearing);
  const monthNow: number = new Date().getMonth();
  const [montbCalendar, setMonthCalendar]: [number, React.Dispatch<any>] = useState<number>(monthNow);
  const [activeStartDate, setActiveStartDate]: any = useState(null);
  const location = useLocation();
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

  const handleClassname = ({ date, view }: any) => {
    if (view === 'month') {
      const dateConvert: Date = new Date(date);
      if (date.getMonth() !== montbCalendar) {
        return 'day-not-month';
      }
      if ((dateConvert.getDay() === 0 || dateConvert.getDay() === 6) && dateConvert.getMonth() !== montbCalendar) {
        return 'hearing-disabled';
      }
    }
  };

  // HANDLE DISPLAY DATE
  useEffect(() => {
    const tmpDateHearing = hearingData[saveIdHearing - 1]?.date;
    const valueConvert = new Date(
      `${tmpDateHearing?.year}-${tmpDateHearing?.month}-${tmpDateHearing?.day}`?.replace(/-/g, '/'),
    );

    if (showHearingCalendarModal) {
      if (tmpDateHearing !== '') {
        setValue(valueConvert);
        setActiveStartDate(tmpDateHearing && valueConvert);
        setMonthCalendar(tmpDateHearing && tmpDateHearing?.month - 1);
        const findExistDayHearing = hearingData?.filter((hearingItem: any) =>
          isSameDay(
            valueConvert,
            new Date(
              `${hearingItem?.date?.year}-${hearingItem?.date?.month}-${hearingItem?.date?.day}`?.replace(/-/g, '/'),
            ),
          ),
        );
        const tmpHourArray = hourArray?.map((hourItem: any) => {
          const checkHearingExist = findExistDayHearing?.find((item: any) => item?.time === hourItem?.id);
          if (hearingData[saveIdHearing - 1]?.time === hourItem.id && checkHearingExist?.id === saveIdHearing) {
            return {
              ...hourItem,
              active: true,
              blocked: false,
            };
          } else if (checkHearingExist && checkHearingExist?.id !== saveIdHearing) {
            return {
              ...hourItem,
              blocked: true,
            };
          }
          return {
            ...hourItem,
            active: false,
          };
        });

        const tmpDateString: string = `${valueConvert?.getFullYear()}年${
          valueConvert?.getMonth() + 1
        }月${valueConvert?.getDate()}日（${dayItems[valueConvert?.getDay()]}）`;

        // SET STATE
        setDisplayDate(tmpDateString);
        setHourArray(tmpHourArray);
      }
      if (tmpDateHearing === '') {
        setValue(null);
        setActiveStartDate(null);
        setMonthCalendar(new Date().getMonth());
        const tmpHourArray = hourArray?.map((hourItem: any) => {
          return {
            ...hourItem,
            active: false,
            blocked: false,
          };
        });
        setHourArray(tmpHourArray);
      }
    }
  }, [showHearingCalendarModal]);

  // =>>>>>>> CALENDAR SETTING END
  const tileDisabled = ({ date, view }: any): boolean | undefined => {
    const dateNow: Date = new Date();
    if (view === 'month') {
      const dateConvert: Date = new Date(date);
      if (
        ((dateConvert.getDay() === 0 || dateConvert.getDay() === 6) && date.getMonth() === montbCalendar) ||
        date.getMonth() < dateNow.getMonth() ||
        (date.getMonth() === dateNow.getMonth() && date.getDate() <= dateNow.getDate())
      ) {
        return true;
      }
    }
  };

  const onChange = (value: any): void => {
    const dateNow: Date = new Date();
    const findExistDay = hearingData?.filter(
      (item: any) =>
        item?.date?.day === value?.getDate() &&
        item?.date?.month === value?.getMonth() + 1 &&
        item?.date?.year === value?.getFullYear(),
    );

    if (findExistDay) {
      if (isSameDay(dateNow, value)) {
        const tmpHourArray = hourArray?.map((hour: any) => {
          if (hour.value <= dateNow.getHours() || findExistDay?.find((item: any) => item?.time === hour?.id)) {
            return {
              ...hour,
              blocked: true,
            };
          } else {
            return {
              ...hour,
              blocked: false,
            };
          }
        });
        setHourArray(tmpHourArray);
      } else {
        const tmpHourArray = hourArray?.map((hour: any) => {
          if (
            findExistDay?.find((item: any) => item?.time === hour?.id) &&
            findExistDay?.find((item: any) => item?.time === hour?.id)?.id !== saveIdHearing
          ) {
            return {
              ...hour,
              blocked: true,
            };
          } else if (
            findExistDay?.find((item: any) => item?.time === hour?.id) &&
            findExistDay?.find((item: any) => item?.time === hour?.id)?.id === saveIdHearing
          ) {
            return {
              ...hour,
              blocked: false,
              active: true,
            };
          } else
            return {
              ...hour,
              blocked: false,
              active: false,
            };
        });

        setHourArray(tmpHourArray);
      }
    } else {
      if (isSameDay(dateNow, value)) {
        const tmpHourArray = hourArray?.map((hour: any) => {
          if (hour.value <= dateNow.getHours()) {
            return {
              ...hour,
              blocked: true,
            };
          } else {
            return {
              ...hour,
              blocked: false,
            };
          }
        });
        setHourArray(tmpHourArray);
      } else {
        const tmpHourArray = hourArray?.map((hour: any) => {
          return {
            ...hour,
            blocked: false,
          };
        });
        setHourArray(tmpHourArray);
      }
    }

    // CONVERT DATE TO STRING
    const valueConvert: Date = new Date(value);
    const tmpDateString: string = `${valueConvert?.getFullYear()}年${
      valueConvert?.getMonth() + 1
    }月${valueConvert?.getDate()}日（${dayItems[valueConvert?.getDay()]}）`;
    // SET STATE

    setDisplayDate(tmpDateString);
    setValue(value);
  };

  // HANDLE SCHEDULE
  const handleSchedule = (item: any): void => {
    const tmpHourArray = hourArray?.map((hourItem: any): any => {
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
    });
    setHourArray(tmpHourArray);
  };

  const onSubmit = (): void => {
    if (checkSubmit && value !== null) {
      const dateConvert: Date = new Date(value);
      const filterDate = hourArray?.filter((item: any): boolean => item.active === true);
      if (filterDate?.length !== 0) {
        handleHearingData(saveIdHearing, 'date', undefined, {
          date: {
            year: dateConvert.getFullYear(),
            month: dateConvert.getMonth() + 1,
            day: dateConvert.getDate(),
            dateTimeFull: dateConvert,
          },
          time: filterDate[0]?.id,
        });

        let hearingDataClone = hearingData.map((item: any, index: number) => {
          if (index === +saveIdHearing - 1) {
            let date = {
              day: value.getDate(),
              month: value.getMonth() + 1,
              year: value.getFullYear(),
            };
            let time = filterDate[0]?.id;

            return { ...item, date, time };
          } else {
            return item;
          }
        });

        setHearingData(hearingDataClone);
        setShowHearingCalendarModal(false);
        setValue(null);
        setHourArray(hourArrayItemsHearing);
      }
    }
  };

  // RESET DATA
  const resetData = (): void => {
    setValue(null);
    setHourArray(
      hourArray?.map((item: any) => {
        return {
          ...item,
          active: false,
          blocked: false,
        };
      }),
    );
  };

  // CHECK DATA SUBMIT
  const checkSubmit: boolean = useMemo((): boolean => {
    const resultFind = hourArray?.find((item: any) => item.active);
    if (resultFind) {
      return true;
    } else {
      return false;
    }
  }, [hourArray]);

  return (
    <>
      <Modal
        open={showHearingCalendarModal}
        onCancel={(): void => {
          setShowHearingCalendarModal(false);
          resetData();
        }}
        footer={false}
        closeIcon={false}
        className="modal-customer-schedule"
        destroyOnClose={true}
      >
        <div className={'calendar-block'}>
          <Calendar
            value={value}
            onChange={onChange}
            defaultValue={null}
            {...calendarSettings}
            tileDisabled={tileDisabled}
            tileClassName={handleClassname}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={(value: any) => {
              const month = new Date(value?.activeStartDate).getMonth();
              setMonthCalendar(month);
              setActiveStartDate(new Date(value?.activeStartDate));
            }}
            formatDay={(_: string | undefined, date: Date) => {
              const tmpMonthCalendar: number = new Date(date).getMonth();
              if (montbCalendar === tmpMonthCalendar) {
                return `${date.getDate()}`;
              }
              return '';
            }}
          />

          <div className="item-selected">
            {value === null ? '' : <button className="btn-date">{value === '' ? '' : displayDate}</button>}
            {location.pathname === '/user/mypage/hearing' ? (
              <span className="item-date-empty"></span>
            ) : (
              <span className="item-date">サービス開始時刻を選択</span>
            )}

            <div className="item-hour-line">
              <div className="list-hour customer-hearing-list-hour">
                {hourArray.map((item: any) => {
                  return (
                    <button
                      key={item.id}
                      onClick={(): void => {
                        if (!item.blocked) {
                          handleSchedule(item);
                        }
                      }}
                      className={`btn-hour${item.active && item?.blocked === false ? ' btn-hour-active' : ''}${
                        item.blocked ? ' disabled' : ''
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
              <div className="check-hour ts-1 text-calendar-hearing">
                <div>
                  {/* <span className="check-hour-item-modal">依頼時間を選択</span>
                <span className="checkbox-warning"> *必須項目</span> */}
                  <span>※ 土・日・祝日はヒアリングを行なっておりません。ご了承ください。</span>
                </div>
              </div>
            </div>
          </div>
          <div className="block-modal-calendar">
            <button
              className="btn btn-check"
              onClick={(): void => {
                setShowHearingCalendarModal(false);
                resetData();
              }}
            >
              閉じる
            </button>
            <button
              className={`btn btn-check${checkSubmit && value !== null ? ' cr-allow' : ' not-allowed'}`}
              onClick={onSubmit}
            >
              確定
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CalendarHearingModal;
