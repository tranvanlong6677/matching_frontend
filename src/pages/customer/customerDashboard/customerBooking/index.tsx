/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dispatch } from 'redux';
import { addDays } from 'date-fns';
import { Button, Collapse, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { getBookings, putFinishMatching, updateStatusMatching } from '../../../../redux/services/customerSlice';
import { hourArrayItemsForBooking } from '../../../../utils/hourArrayItems';
import ModalSuccess from '../../../../components/modalSuccess/modalSuccess';
import { hourScheduleItems } from '../../../../utils/hourScheduleItems';
import { alertSuccess, convertMoney, setLocalStorage } from '../../../../helper/common';
import image from '../../../../assets/images/index';
import config from '../../../../config';

const FEE_EXTEND_ASSIGN: string = '7,000';
const FEE_EXTEND_NOT_ASSIGN: string = '6,000';

export default function CustomerBooking({ isEdit = false }) {
  const { Panel }: any = Collapse;
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  const [isLate, setIsLate]: any = useState<boolean>(false);
  const [idBookingMatchDelete, setIdBookingMatchDelete]: any = useState<number>();
  const [idBookingMatchUpdate, setIdBookingMatchUpdate]: any = useState<number>();
  const [typeModal, setTypeModal]: [any, React.Dispatch<any>] = useState<string>();
  const [timeManage, setTimeManage]: any = useState<any>([]);

  const { listBooking, currentTime } = useSelector((state: any) => state.customerReducer);
  // TEST Timeout
  useEffect((): void => {
    dispatch(getBookings());
  }, []);

  useEffect((): void => {
    if (listBooking?.length !== 0) {
      setTimeManage(
        listBooking?.map((booking: any): any => {
          return {
            id: booking?.id ?? booking?.customer_service_id,
            date: booking?.date,
            date_time: currentTime?.split(':'),
            date_hour: currentTime?.split(':'),
            end_time: booking?.end_time,
            start_time: booking?.start_time,
            status: booking?.status,
            status_matching: booking?.status_matching,
            is_extend: booking?.is_extend,
          };
        }),
      );
    }
  }, [listBooking]);

  useEffect(() => {
    if (timeManage?.length > 0) {
      let timeName = timeManage?.map((timeItem: any): any => {
        return {
          timeName: timeItem?.id,
        };
      });

      let current_time: any = '';

      if (currentTime !== '') {
        const convertTime = currentTime?.split(' ');
        // const date_time = convertTime[0];
        // const date_hour = convertTime[1]?.split(':');

        //   Fake time
        // current_time = new Date(date_time).setHours(+date_hour[0], +date_hour[1], +date_hour[2], 999);
        current_time = Date.now();
      }

      for (let i: number = 0; i < timeManage?.length; i++) {
        // HANDLE TIME
        const beforeOneDay: number = addDays(new Date(timeManage[i]?.date), -1).setHours(18, 59, 59, 999); // 19:00 THE DAY BEFORE
        const findStartHour: any = hourArrayItemsForBooking.find((hour: any) => hour?.id === timeManage[i]?.start_time); //FIND START HOUR
        const findEndHour: any = hourArrayItemsForBooking.find((hour: any) => hour?.id === timeManage[i]?.end_time); // FIND END HOUR
        const timeStart: number = new Date(timeManage[i]?.date).setHours(findStartHour?.hour, 0, 0, 0); // TIME BOOKING START
        const tenMinutesBeforeEndTime: number = new Date(timeManage[i]?.date).setHours(findEndHour?.hour, 50, 0, 0); // 10 MINUTES BEFORE CLOSING TIME
        const timeEnd: number = new Date(timeManage[i]?.date).setHours(findEndHour?.hour + 1, 0, 0, 0); // CLOSING TIME
        const fifteenMinutesAfterEndTime: number = new Date(timeManage[i]?.date).setHours(
          findEndHour?.hour + 1,
          15,
          0,
          0,
        ); //15 MINUTES AFTER CLOSING TIME
        const endHourExtend: number = new Date(timeManage[i]?.date).setHours(findEndHour.hour + 2, 0, 0, 0); // 1 HOUR AFTER END TIME

        // STATUS 1 :  19:00 THE DAY BEFORE
        // if (timeManage[i]?.status === 1 && current_time < beforeOneDay) {
        if (current_time < beforeOneDay && beforeOneDay - current_time < 1000000000) {
          if (timeManage[i]?.status === 1) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 2,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, beforeOneDay - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          }
        }

        // STATUS 2 : TIME BOOKING START
        // if (timeManage[i]?.status === 2 && current_time < timeStart) {
        if (current_time < timeStart && current_time > beforeOneDay && timeManage[i]?.status_matching !== 0) {
          if (timeManage[i]?.status === 2) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 3,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, timeStart - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          } else {
            const handleUpdateStatus = async (): Promise<void> => {
              await dispatch(
                updateStatusMatching({
                  id: timeManage[i]?.id,
                  body: {
                    status: 2,
                  },
                }),
              );
            };

            handleUpdateStatus();
          }
        }

        // STATUS 3 : 10 MINUTES BEFORE CLOSING TIME
        // if (timeManage[i]?.status === 3 && current_time < tenMinutesBeforeEndTime) {
        if (
          current_time < tenMinutesBeforeEndTime &&
          current_time > timeStart &&
          timeManage[i]?.status_matching !== 0
        ) {
          if (timeManage[i]?.status === 3) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 4,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, tenMinutesBeforeEndTime - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          } else {
            const handleUpdateStatus = async (): Promise<void> => {
              await dispatch(
                updateStatusMatching({
                  id: timeManage[i]?.id,
                  body: {
                    status: 3,
                  },
                }),
              );
            };

            handleUpdateStatus();
          }
        }

        // STATUS 4 : CLOSING TIME
        // if (timeManage[i]?.status === 4 && current_time < timeEnd) {

        if (
          current_time < timeEnd &&
          current_time > tenMinutesBeforeEndTime &&
          timeManage[i]?.status_matching !== 0 &&
          timeManage[i]?.is_extend !== 1
        ) {
          if (timeManage[i]?.status === 4 && timeManage[i]?.is_extend !== 1) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 5,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, timeEnd - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          } else {
            const handleUpdateStatus = async (): Promise<void> => {
              await dispatch(
                updateStatusMatching({
                  id: timeManage[i]?.id,
                  body: {
                    status: 4,
                  },
                }),
              );
            };

            handleUpdateStatus();
          }
        }

        // STATUS 5 : 15 MINUTES AFTER CLOSING TIME
        // if (timeManage[i]?.status === 5 && current_time < fifteenMinutesAfterEndTime) {
        if (
          current_time < fifteenMinutesAfterEndTime &&
          current_time > timeEnd &&
          timeManage[i]?.status_matching !== 0 &&
          timeManage[i]?.is_extend !== 1
        ) {
          if (timeManage[i]?.status === 5) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 6,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, fifteenMinutesAfterEndTime - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          } else {
            const handleUpdateStatus = async (): Promise<void> => {
              await dispatch(
                updateStatusMatching({
                  id: timeManage[i]?.id,
                  body: {
                    status: 5,
                  },
                }),
              );
            };

            handleUpdateStatus();
          }
        }

        //   HANDLE STATUS 7: EXTENDED
        if (current_time < endHourExtend && current_time > timeEnd && timeManage[i]?.status_matching !== 0) {
          if (timeManage[i]?.status === 7) {
            const timerId: NodeJS.Timeout = setTimeout((): void => {
              const handleUpdateStatus = async (): Promise<void> => {
                await dispatch(
                  updateStatusMatching({
                    id: timeManage[i]?.id,
                    body: {
                      status: 6,
                    },
                  }),
                );
              };

              handleUpdateStatus();
            }, endHourExtend - current_time);

            timeName[i] = {
              ...timeName[i],
              name: timerId,
            };
          }
        }
      }

      return (): void => {
        const findTimeEnd = timeManage?.find((time: any) => time?.active);
        const findTimeNameEnd = timeName?.find((itemTimeName: any): boolean => itemTimeName?.id === findTimeEnd?.id);
        clearTimeout(findTimeNameEnd?.name);
      };
    }
  }, [timeManage]);

  const handleClickCancel = (item: any): void => {
    let dateCurrent: Date = new Date();
    setIdBookingMatchDelete(item?.id);
    let beforeDay: Date = new Date(addDays(new Date(item?.date), -1).setHours(18, 59, 59, 999));
    if (dateCurrent > beforeDay) {
      setTypeModal('delete_booking');
      setIsLate(true);
    }
    if (dateCurrent < beforeDay) {
      navigate(`/user/mypage/reserve/select/${item?.id}/cancel`);
    }
  };
  const handleClickChange = (item: any): void => {
    let dateCurrent: Date = new Date();
    let beforeDay: Date = new Date(addDays(new Date(item?.date), -1).setHours(18, 59, 59, 999));
    if (dateCurrent < beforeDay) {
      navigate(`${config.routes.customerChangeBooking}/${item?.id}`);
    }
  };
  const handleClickExtend = (item: any): void => {
    setTypeModal('update_booking');
    setIsLate(true);
    setIdBookingMatchUpdate(item?.id);
  };

  //Handle finish job
  const handleFinishJob = async (item: any): Promise<void> => {
    const matchingReverseData: any = {
      date: item?.dateStringWithoutTime,
      name: item?.is_assign ? (item?.is_assign === 1 ? item?.cast_name_assign : item?.cast_name_not_assign) : '',
    };
    setLocalStorage('mrsdt', matchingReverseData);
    const res = await dispatch(putFinishMatching(item?.id));
    if (res?.payload?.status === 'success') {
      alertSuccess(api, '変更が完了しました。');
      navigate(`${config.routes.customerSurvey}/${item?.id}`);
    } else {
      alertSuccess(api, '変更に失敗しました。');
    }
  };

  return (
    <div className="customer-booking container-680">
      {showPopup}
      <ModalSuccess
        cast
        type={typeModal}
        showChangeWarning={isLate}
        setShowChangeWarning={setIsLate}
        idBookingMatchDelete={idBookingMatchDelete}
        idBookingMatchUpdate={idBookingMatchUpdate}
      />
      <div className="title">
        <img src={image.infoIcon} alt="" />
        <h1>予約内容詳細</h1>
      </div>
      <div className="list-services">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
          expandIconPosition={'end'}
        >
          {listBooking?.map((item: any) => {
            return (
              <Panel
                header={
                  <div>
                    <p>{item.dateString}</p>
                    <p className="booking-status">
                      依頼ステータス :
                      <span
                        style={
                          item?.status_matching === 1
                            ? {
                                color: '#2EA7E0',
                              }
                            : {}
                        }
                      >
                        {item?.status_matching === 0 ? ' キャストアサイン中' : ' 確定'}
                      </span>
                    </p>
                  </div>
                }
                key={item.id}
              >
                <div className="service-detail">
                  <div className="service-detail-element">
                    <span className="field">予約日時</span>
                    <span className="value">{item?.dateString !== undefined ? item?.dateStringWithTime : ''}</span>
                  </div>
                  <div className="service-detail-element">
                    <span className="field">依頼時間 </span>
                    <span className="value">
                      {item?.hour !== undefined ? hourScheduleItems[item?.hour - 2]?.title : ''}
                    </span>
                  </div>
                  {item?.is_assign !== undefined ? (
                    <div className="service-detail-element">
                      <span className="field">キャスト指名</span>
                      <span className="value">{item?.assign_text}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  {item?.is_extend === 1 ? (
                    <div className="service-detail-element">
                      <span className="field">延長料金</span>
                      <span className="value">{`¥${
                        item?.is_assign === 1 ? FEE_EXTEND_ASSIGN : FEE_EXTEND_NOT_ASSIGN
                      }`}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="service-detail-element">
                    <span className="field">概算料金</span>
                    <span className="value">{`¥${convertMoney(item?.price?.toString()) ?? '0'}(税込)`}</span>
                  </div>
                  {item?.status === 1 && (
                    <div className={'btn-extend'}>
                      <Button
                        type="primary"
                        className="change"
                        onClick={(): void => {
                          handleClickChange(item);
                        }}
                      >
                        日時変更
                      </Button>
                      <Button type="primary" className="cancel" onClick={(): void => handleClickCancel(item)}>
                        キャンセル
                      </Button>
                      <Button type="primary" className="add-hour" disabled={true}>
                        <img src={image.iconPlusExtend} alt="Error" />
                        1時間延長
                      </Button>
                    </div>
                  )}
                  {item?.status === 2 && (
                    <div>
                      <div className={'btn-extend secondary'}>
                        <Button type="primary" className="cancel" onClick={(): void => handleClickCancel(item)}>
                          キャンセル
                        </Button>
                        <Button
                          type="primary"
                          className="add-hour"
                          onClick={() => handleClickExtend(item)}
                          disabled={true}
                        >
                          <img src={image.iconPlusExtend} alt="Error" />
                          1時間延長
                        </Button>
                      </div>
                    </div>
                  )}
                  {item?.status === 3 && (
                    <div className="btn-extend secondary">
                      <Button type="primary" disabled={true} className="btn-finish">
                        作業完了
                      </Button>
                      <Button
                        type="primary"
                        className="add-hour"
                        onClick={() => handleClickExtend(item)}
                        disabled={true}
                      >
                        <img src={image.iconPlusExtend} alt="Error" />
                        1時間延長
                      </Button>
                    </div>
                  )}
                  {item?.status === 4 && (
                    <div className="btn-extend secondary">
                      <Button type="primary" disabled={true} className="btn-finish">
                        作業完了
                      </Button>
                      {item?.is_extend === 0 ? (
                        <Button type="primary" className="add-hour active" onClick={() => handleClickExtend(item)}>
                          <img src={image.iconPlusExtend} alt="Error" />
                          1時間延長
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {item?.status === 5 && (
                    <div className="btn-extend secondary">
                      <Button type="primary" className="btn-finish active" onClick={() => handleFinishJob(item)}>
                        作業完了
                      </Button>
                      {item?.is_extend === 0 ? (
                        <Button type="primary" className="add-hour active" onClick={() => handleClickExtend(item)}>
                          <img src={image.iconPlusExtend} alt="Error" />
                          1時間延長
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {item?.status === 6 && (
                    <div className="btn-extend secondary">
                      <Button type="primary" className="btn-finish active" onClick={() => handleFinishJob(item)}>
                        作業完了
                      </Button>
                    </div>
                  )}
                  {item?.status === 7 && (
                    <div className="btn-extend secondary">
                      <Button
                        type="primary"
                        className="btn-finish"
                        onClick={() => handleFinishJob(item)}
                        disabled={true}
                      >
                        作業完了
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
          <div className="note">
            <span className="note-item">※ 日時変更・キャンセルは詳細より選択いただけます。</span>
            <span className="note-item">※ 最新の10件を表示</span>
          </div>
        </Collapse>
      </div>
      <span className="instruct">
        キャンセル及び変更に関する注意点は<a href="#">コチラ</a>
      </span>
      <div className="extensions">
        <div className="extensions-title">
          <img src={image.iconHourglass} alt="" />
          <span>延長について</span>
        </div>
        <p className="extensions-content">
          サービス終了時刻＋15分までに延長を行ってください。
          <br /> 終了時刻＋15分後には延長はできなくなります。
        </p>
      </div>
      <div className="btn-reserve-block">
        <Button
          className="btn"
          onClick={(): void => {
            navigate(config.routes.customerDashboard);
          }}
        >
          戻る
        </Button>
      </div>
    </div>
  );
}
