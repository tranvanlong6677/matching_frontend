import { CSVLink } from 'react-csv';
import { isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, MenuProps, Space, Spin, notification } from 'antd';

import {
  getAllCalendarCurrentMonth,
  getCastDetail,
  getListShiftCast,
  getServiceDetail,
  putRankUser,
} from '../../../redux/services/adminSlice';
import { availableServiceItems } from '../../../utils/availableServiceItems';
import { transportationItems } from '../../../utils/transportationItems';
import { castExperience } from '../../../utils/castExperience';
import { rankCastItems } from '../../../utils/rankCastItems';
import { listGender } from '../../../utils/genderItems';
import { alertSuccess, formatCash } from '../../../helper/common';
import _ from 'lodash';
import { serviceItems } from '../../../utils/customerServiceItems';
import { hourScheduleItems } from '../../../utils/hourScheduleItems';

const accountType: any = [
  {
    label: '普通',
    value: 0,
  },
  {
    label: '当座',
    value: 1,
  },
  {
    label: '貯蓄',
    value: 2,
  },
];

const statusAudit: any = [
  {
    label: '完了',
    key: '1',
  },
  {
    label: '未完了',
    key: '0',
  },
];
const statusTraining: any = [
  {
    label: '完了',
    key: '1',
  },
  {
    label: '未完了',
    key: '0',
  },
];

const CalendarComponent = () => {
  const { id }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK STATE
  const [detailCastCSV, setDetailCastCSV]: [any, React.Dispatch<any>] = useState<any>([]);
  const [arrCalendarData, setArrCalendarData]: [any, React.Dispatch<any>] = useState<any[]>([]);
  const [dateSelectedState, setDateSelectedState] = useState<any>();
  const [showTime, setShowTime] = useState<number | null>(); // date is selected
  const [arrIdTimeMatch, setArrIdTimeMatch] = useState<number[]>([]); // show block time
  const [calendarCurrentMonthState, setCalendarCurrentMonthState]: [any, React.Dispatch<any>] = useState<any>([]);

  // REDUCERS
  const { calendarDataCast, serviceDetail, loading, castDetail, calendarCurrentMonth } = useSelector(
    (state: any) => state.adminReducer,
  );

  // CALENDAR SETTINGS
  const calendarSettings: any = {
    locale: 'ja',
    calendarType: 'US',
    next2Label: null,
    prev2Label: null,
  };

  // HOUR ARRAY
  const hourArray: any = [
    {
      id: 1,
      title: '09:00 ~ 10:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 2,
      title: '10:00 ~ 11:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 3,
      title: '11:00 ~ 12:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 4,
      title: '12:00 ~ 13:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 5,
      title: '13:00 ~ 14:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 6,
      title: '14:00 ~ 15:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 7,
      title: '15:00 ~ 16:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 8,
      title: '16:00 ~ 17:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 9,
      title: '17:00 ~ 18:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 10,
      title: '18:00 ~ 19:00',
      active: false,
      isParent: false,
      blocked: false,
    },
    {
      id: 11,
      title: '19:00 ~ 20:00',
      active: false,
      isParent: false,
      blocked: false,
    },
  ];

  // ---------------------- HOOK EFFECT --------------------
  useEffect(() => {
    dispatch(getCastDetail(id));
    dispatch(getAllCalendarCurrentMonth(id));
    // GET CALENDAR WITH MONTH
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let monthList: any = [];

    for (let i = 0; i <= 5; i++) {
      let month = currentMonth + i;
      if (currentMonth + i > 12) {
        month = month % 12;
        monthList.push({ month: month, year: currentYear + 1 });
      } else {
        monthList.push({ month: month, year: currentYear });
      }
    }

    let monthListConfig: any[] = [];

    if (monthList) {
      monthList?.map((item: any, index: number) => {
        monthListConfig.push({
          id: index + 1,
          startDate: `${item?.year}/${item?.month}/01`,
        });
      });
      setArrCalendarData(monthListConfig);
    }
    //call api get data cast calendar
    if (id) {
      dispatch(getListShiftCast(+id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // sort calendarCurrentMonth
    let calendarCurrentMonthClone = calendarCurrentMonth?.map((item: any, index: any) => {
      let dateFormat: Date = new Date(item?.date);
      return { ...item, dateFormat: dateFormat, key: `item-${index}` };
    });

    calendarCurrentMonthClone?.sort((a: any, b: any) => a?.dateFormat - b?.dateFormat);

    setCalendarCurrentMonthState([]);

    if (calendarCurrentMonthClone && calendarCurrentMonthClone?.length > 0) {
      let dataCalendarCast = calendarCurrentMonthClone?.map((item: any, index: any) => {
        return { ...item, address: `${item.city}-${item.province}`, key: `item-${index}` };
      });
      setCalendarCurrentMonthState(dataCalendarCast);
    }
  }, [calendarCurrentMonth]);

  // HANDLE DATA CSV
  useEffect(() => {
    if (castDetail) {
      const tmpDataCurrentMonths = calendarCurrentMonthState?.map((item: any) => {
        return _.values({
          service: serviceItems[item?.service_id - 1]?.label ?? '',
          date: convertDate(item?.date) ?? '',
          hour: hourScheduleItems[item?.hour - 2]?.title ?? '',
          user_name: item?.user_name ? `${item?.user_name}${item?.user_id ? `-A${item?.user_id}` : ''}` : '',
          address: item?.address ?? '',
          price: formatCash(item?.price.toString()) ?? '',
          extend: item?.extend === 0 ? '' : 'あり',
          assign: item?.assign === null || item?.assign === undefined ? '' : 'あり',
          coupon: item?.coupon === null ? '' : 'あり',
        });
      });

      const castDataExportCSV: any = [
        ['氏名', '登録日', 'キャストID', 'ランク'],
        [
          castDetail?.name,
          convertDate(castDetail?.created_at),
          `B${castDetail?.id}`,
          `${rankCastItems[castDetail?.rank - 1]?.label || 'レギュラー'} `,
        ],
        [],
        [
          'メールアドレス',
          '生年月日',
          '性別',
          '住所',
          '最寄駅',
          '最寄駅からの移動手段',
          '最寄駅からの時間',
          '緊急連絡先',
          '緊急連絡先氏名',
          '緊急連絡先続柄',
          '家事経験年数',
          '可能提供サービス',
        ],
        [
          castDetail?.email,
          convertDate(castDetail?.dob),
          listGender[+castDetail?.gender - 1],
          castDetail?.address,
          castDetail?.station,
          transportationItems[+castDetail?.transportation]?.title,
          castDetail?.station_time,
          castDetail?.etc_name,
          castDetail?.ecn,
          castDetail?.etc_relationship,
          castExperience[+castDetail?.year_experience - 1]?.title,
          availableServiceItems[+castDetail?.available_service - 1]?.title,
        ],
        [],
        [
          'ご希望の月額報酬',
          '金融機関名',
          '支店名',
          '預金種別',
          '口座番号',
          '口座名義',
          '面談ステータス',
          'トレーニングステータス',
          'パスワード',
        ],
        [
          '',
          castDetail?.bank_name,
          castDetail?.store_name,
          accountType[castDetail?.account_type - 1]?.label,
          castDetail?.account_number,
          castDetail?.account_name,
          statusAudit[castDetail?.audit_status]?.label,
          statusTraining[castDetail?.training_status]?.label,
          castDetail?.password_description,
        ],
        [],
        ['面談メモ'],
        [castDetail?.memo_audit],
        [],
        ['キャスト時給 (円)'],
        [castDetail?.salary_hour],
        [],
        ['給与金額 (円)', '出勤回数 (数)', '出勤時間 (時間)', '交通費 (円)', '指名回数 (回)'],
        [castDetail?.salary, '5回', '15時間', '00,000円', '2回'],
        [],
        ['依頼内容', '依頼日', '依頼時間', '依頼者', '住所', '料金', '延長', 'キャンセル', '指名', 'クーポン利用'],
        ...tmpDataCurrentMonths,
      ];
      setDetailCastCSV(castDataExportCSV);
    }
  }, [castDetail, calendarCurrentMonthState]);

  // HANDLE CHECK ACTIVE TIME
  useEffect(() => {
    handleCheckActiveTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceDetail]);

  const handleCheckActiveTime = () => {
    let arrIdHourActive: any = [];
    if (serviceDetail && serviceDetail?.length > 0) {
      for (let j = 0; j < serviceDetail?.length; j++) {
        for (let i = serviceDetail[j]?.start_time; i < serviceDetail[j]?.end_time + 1; i++) {
          arrIdHourActive.push(i);
        }
      }
      setArrIdTimeMatch(arrIdHourActive);
    }
  };

  const onChange = (dateSelected: any, id: number) => {
    setArrIdTimeMatch([]);
    setDateSelectedState(dateSelected);
    if (isSameDay(dateSelected, dateSelectedState) && showTime !== null) {
      setShowTime(null);
      setDateSelectedState(null);
      return;
    }
    calendarDataCast?.map((item: any) => {
      if (isSameDay(new Date(item?.date), dateSelected)) {
        let data = {
          user_id: +item.user_id,
          date: item.date,
        };
        dispatch(getServiceDetail(data));
      }
    });
    setShowTime(id);
  };

  // CLASSNAME REACT CALENDAR
  const handleClassname = (date: any, view: any, item: any) => {
    const month: number = new Date(item?.startDate).getMonth();
    const monthCalendar: number = new Date(date).getMonth();
    let className: string = '';
    if (view === 'month' && calendarDataCast?.length > 0 && serviceDetail) {
      for (let i = 0; i < calendarDataCast?.length; i++) {
        if (isSameDay(new Date(calendarDataCast[i].date), date)) {
          className += 'selected-day';
        }
      }
    }

    if (monthCalendar !== month) {
      className += ' white-disable';
    }
    return className;
  };

  // HANDLE RANK
  const handleRankItem: MenuProps['onClick'] = async ({ key }) => {
    try {
      if (Number(key) !== castDetail?.rank) {
        const res: any = await dispatch(putRankUser({ id, rank: { rank: key } }));
        if (res?.payload?.status === 'success') {
          dispatch(getCastDetail(castDetail?.id));
          alertSuccess(api, '変更が完了しました。');
        } else {
          alertSuccess(api, '変更に失敗しました。');
        }
      }
    } catch (error) {}
  };

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  return (
    <div className="calendar-wrapper">
      {showPopup}
      <div className="csv-block">
        <CSVLink target="_blank" data={detailCastCSV ? detailCastCSV : []} filename={`cast-detail-export-${id}.csv`}>
          <button className="csv">CSV出力</button>
        </CSVLink>
      </div>
      <div className="admin-input-group">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 氏名</span>
          </div>
          <input className="input-admin-global disable" type="text" value={castDetail ? castDetail?.name : 'ー'} />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 登録日</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={castDetail ? convertDate(castDetail?.created_at) : 'ー'}
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> キャストID</span>
          </div>
          <input className="input-admin-global disable" type="text" value={castDetail?.id && `B${castDetail?.id}`} />
        </div>
        <div className="admin-input-item rank-item">
          <div className="admin-listct-label">
            <span>ランク</span>
          </div>
          <div className="input-admin-global disable">
            <div className="btn-icon-dropdown">
              <span className="rank-item-admin">
                {castDetail?.rank === null ? 'レギュラー' : rankCastItems[castDetail?.rank - 1]?.label}
              </span>
            </div>
          </div>
          <Space>
            <Dropdown
              trigger={['click']}
              placement={'bottomRight'}
              overlayClassName="dropdown-detail"
              menu={{ items: rankCastItems, onClick: handleRankItem }}
              getPopupContainer={() => {
                let rankSelect: any = document.body.getElementsByClassName('rank-item');
                return rankSelect[0];
              }}
            >
              <button onClick={() => handleRankItem} style={{ textDecoration: 'underline' }}>
                編集
              </button>
            </Dropdown>
          </Space>
        </div>
      </div>
      <div className="calendar-row">
        {arrCalendarData?.map((item: any, index: any) => {
          return (
            <div className="calendar-item" key={`calendar-${index}`}>
              <div className="calendar-item-wrapper">
                <Calendar
                  {...calendarSettings}
                  value={dateSelectedState}
                  // showNeighboringMonth={false}
                  tileClassName={({ date, view }) => handleClassname(date, view, item)}
                  tileDisabled={({ activeStartDate, date, view }) => {
                    const month: number = new Date(item?.startDate).getMonth();
                    const monthCalendar: number = new Date(date).getMonth();
                    if (month !== monthCalendar) {
                      return true;
                    }
                  }}
                  activeStartDate={new Date(item.startDate)}
                  onChange={(dateSelected: any) => onChange(dateSelected, item.id)}
                  formatDay={(_, date) => {
                    const month: number = new Date(item?.startDate).getMonth();
                    const monthCalendar: number = new Date(date).getMonth();
                    if (month === monthCalendar) {
                      return date.getDate();
                    }
                    return '';
                  }}
                />
              </div>

              {showTime === item.id && (
                <Spin spinning={loading}>
                  <div className="item-selected">
                    <div className="item-hour-line">
                      <div className="list-hour">
                        {hourArray?.map((item: any) => {
                          arrIdTimeMatch?.map((idItem: number) => {
                            if (item.id === idItem) {
                              item = { ...item, active: true };
                            }
                          });
                          return (
                            <button
                              key={item.id}
                              className={`btn-hour${item.active ? ' btn-hour-active' : ''}${
                                item.blocked ? ' not-allowed' : ''
                              }`}
                            >
                              <span>{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Spin>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarComponent;
