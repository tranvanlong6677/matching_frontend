import { Dispatch } from 'redux';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React, { ReactElement, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useNotification from 'antd/es/notification/useNotification';
import { Badge, Collapse, Dropdown, MenuProps, Space, Spin } from 'antd';

import {
  alertFail,
  alertSuccess,
  convertDateMatching,
  formatPostalCode,
  getLocalStorage,
  setLocalStorage,
} from '../../../helper/common';
import { serviceItems } from '../../../utils/customerServiceItems';
import { hourArrayItems } from '../../../utils/hourArrayItems';
import { logout } from '../../../redux/services/authSlice';
import images from '../../../assets/images';
import config from '../../../config';
import { CaretDownOutlined } from '@ant-design/icons';
import {
  getAllJobMatching,
  getCastJobCurrentDate,
  getRequireMatching,
  postRequireMatching,
  updateStatusJobMatching,
  updateStatusNotificationMatching,
} from '../../../redux/services/castSlice';

const CastDashboard = () => {
  const { Panel }: any = Collapse;
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = useNotification();

  // HOOK STATE
  const [show, setShow]: [boolean, React.Dispatch<any>] = useState(true);
  const [showPagination, setShowPagination]: any = useState(false);

  // REDUCER
  const { castJobMatching, castJobCurrentDate, castRequireMatching, loading, listJobLoading } = useSelector(
    (state: any) => state.castReducer,
  );

  // GET DATA LOCAL
  const user = getLocalStorage('user');
  const page = getLocalStorage('page_size');

  // HOOK EFFECTS

  useEffect((): void => {
    dispatch(getAllJobMatching(page ?? 10));
    dispatch(getCastJobCurrentDate());
    dispatch(getRequireMatching());
  }, [dispatch]);

  //array pagination
  const itemPage: any = [
    {
      key: 0,
      label: '10件表示',
      value: 10,
    },
    {
      key: 1,
      label: '30件表示',
      value: 30,
    },
    {
      key: 2,
      label: '50件表示',
      value: 50,
    },
    {
      key: 3,
      label: '全て表示',
      value: '',
    },
  ];

  // FILTER MIN
  const dateNow: Date = new Date();

  const sortDataNotifications = (): any => {
    const castMatchingSeen: any =
      Array.isArray(castJobMatching) &&
      castJobMatching?.filter(
        (job: any) =>
          job?.deleted_by !== 0 &&
          job?.status_seen === 1 &&
          job?.status !== 8 &&
          (job?.deleted_at !== null || job?.created_at !== job?.updated_at),
      );
    const castMatchingNotSeen = castJobMatching?.filter(
      (job: any) =>
        job?.status !== 8 &&
        (job?.deleted_at !== null || job?.created_at !== job?.updated_at) &&
        job?.deleted_by !== 0 &&
        (job?.status_seen === 0 || job?.status_seen === 2),
    );
    const castMatchingNotSeenArray = Array.isArray(castMatchingNotSeen) ? castMatchingNotSeen : [];
    const sortJobSeen: any = _.take(_.sortBy(castMatchingSeen, ['updated_at']).reverse(), 2);
    return [...sortJobSeen, ...castMatchingNotSeenArray];
  };

  //VARIABLE HANDLE NOTIFICATION
  const hasUnseenStatus: any =
    castJobMatching?.length !== 0 &&
    castJobMatching?.some((item: any) => item?.status_seen === 0 && item?.deleted_by !== 0);
  const hasUnseenNotification: any =
    castJobMatching?.find(
      (job: any) =>
        job?.deleted_by !== 0 &&
        job?.status_seen === 0 &&
        job?.status !== 8 &&
        (new Date(job?.date) > dateNow || new Date(job?.date) === dateNow) &&
        (job?.deleted_at !== null || job?.created_at !== job?.updated_at),
    ) || castRequireMatching?.length > 0;
  const hasSeenNotification: any = castJobMatching?.find(
    (job: any) =>
      job?.deleted_by !== 0 &&
      job?.status_seen === 0 &&
      job?.status !== 8 &&
      (new Date(job?.date) > dateNow || new Date(job?.date) === dateNow) &&
      (job?.deleted_at !== null || job?.created_at !== job?.updated_at),
  );

  const listCastMatching: any = castJobMatching?.filter((item: any): boolean => item?.deleted_by !== 0);
  const listCastMatchingForNotifications = sortDataNotifications();

  const listNewCurrentDate = castJobCurrentDate?.find((item: any): boolean => item?.status_seen === 0);
  //HANDLE PAGINATION DROPDOWN
  const handleJobDropdown: MenuProps['onClick'] = async ({ key }: any): Promise<void> => {
    const selectedItem = itemPage?.find((item: any): boolean => item?.key === Number(key));

    if (selectedItem?.value !== page) {
      dispatch(getAllJobMatching(selectedItem?.value));
    }
    setLocalStorage('page_size', selectedItem?.value);
  };

  // HANDLE UPDATE STATUS
  const handleRead = (id: any, status_seen: any): void => {
    navigate(`${config.routes.calendarDetail}/${id}`);
    if (status_seen === 0 || status_seen === 2) {
      dispatch(updateStatusJobMatching(id));
    }
  };

  // HANDLE REQUIRED MATCHING
  const handleProcessMatching = async (customer_service_id: any): Promise<void> => {
    try {
      const res = await dispatch(
        postRequireMatching({
          customer_service_id: customer_service_id,
        }),
      );
      if (res?.payload?.status === 'success') {
        dispatch(getRequireMatching());
        dispatch(getAllJobMatching(page ?? 10));
        if (getRequireMatching) {
          alertSuccess(api, 'マッチングに必要な成功');
        }
      } else {
        alertFail(api, '必要なマッチングに失敗しました');
      }
    } catch (error) {}
  };

  //handle show pagination
  const handleShowPagination = (key: string | string[]) => {
    if (+key === 3) {
      setShowPagination(true);
    } else setShowPagination(false);
  };

  // HANDLE LOGOUT
  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('page_size');
      navigate(config.routes.logoutCast);
    } catch (error) {}
  };

  //HEADER COLLAPSE

  const headerCollapseNotifications = () => (
    <div
      className="account-setting-element"
      onClick={(): void => {
        listCastMatchingForNotifications?.map((item: any) => {
          if (hasSeenNotification) {
            if (item?.status_seen === 0) {
              dispatch(updateStatusNotificationMatching(item?.id));
            }
            dispatch(getAllJobMatching(page ?? 10));
          }
        });
      }}
    >
      <span className="icon bell">
        <Space>
          <Badge dot={hasUnseenNotification && show}>
            <img src={images.iconBell} alt="" />
          </Badge>
        </Space>
      </span>
      <span className="detail">担当する依頼に関する更新情報</span>
    </div>
  );

  const headerCollapseCalendars = () => (
    <div
      className="account-setting-element"
      onClick={(): void => {
        if (listNewCurrentDate) {
          castJobCurrentDate?.map((item: any) => {
            if (item?.status_seen === 0 || item?.status_seen === 2) {
              return dispatch(updateStatusJobMatching(item?.matching_id));
            }
          });
          dispatch(getCastJobCurrentDate());
        }
      }}
    >
      <span className="icon calendar">
        <Space>
          <Badge dot={listNewCurrentDate && show}>
            <img src={images.iconCalendar} alt="" />
          </Badge>
        </Space>
      </span>
      <span className="detail">本日のご依頼ステータス</span>
    </div>
  );
  const headerCollapseDetails = () => (
    <div className="account-setting-element">
      <span className="icon request">
        <Space>
          <Badge dot={hasUnseenStatus && show}>
            <img src={images.iconRequest} alt="" />
          </Badge>
        </Space>
      </span>
      <span className="detail">ご依頼内容詳細</span>
    </div>
  );

  return (
    <>
      <div className="dashboard">
        <div className="container-680">
          <div className="cast-dashboard-block">
            {showPopup}
            <div className="content-top">
              <div className="name account-setting-element isCast">
                <img className="icon" src={images.iconUser} alt="Error" />
                <div className="detail">
                  <span className="detail-name">{user?.name}</span>
                  <span className="detail-email">{user?.email}</span>
                </div>
              </div>

              {/* LIST NOTIFICATION */}
              <Collapse
                expandIconPosition="end"
                ghost={true}
                className="notification-cast-item"
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
              >
                <Panel header={headerCollapseNotifications()} key="1">
                  <Spin spinning={loading}>
                    {(castRequireMatching && castRequireMatching?.length !== 0) ||
                    (listCastMatchingForNotifications && listCastMatchingForNotifications?.length > 0) ? (
                      <>
                        <div className="notifications-list">
                          {castRequireMatching?.length !== 0
                            ? castRequireMatching?.map((item: any, index: number): any => {
                                return (
                                  <div key={`notification-button-${index}`}>
                                    <div className="notifications-list-item  bg-notification">
                                      <>
                                        <div className="button-notification">
                                          <button onClick={() => handleProcessMatching(item?.customer_service_id)}>
                                            予約を確定します
                                          </button>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">ご予約者様氏名</span>
                                          <span className="notifications-list-element-value">
                                            {`${item?.name}様` || 'なし'}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">サービス</span>
                                          <span className="notifications-list-element-value">
                                            {serviceItems[item?.service_id - 1]?.label}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">予約日時</span>
                                          <span className="notifications-list-element-value">
                                            {`${convertDateMatching(item?.date)} ${
                                              hourArrayItems[item?.start_time - 1]?.title
                                            }〜${hourArrayItems[item?.end_time]?.title}` || 'なし'}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element notification-custom">
                                          <span className="notifications-list-element-field">備考</span>
                                          <span className="notifications-list-element-value">
                                            {item?.request_description || 'なし'}
                                          </span>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                );
                              })
                            : ''}
                        </div>
                        <div className="notifications-list ">
                          {listCastMatchingForNotifications !== 0
                            ? listCastMatchingForNotifications?.map(
                                (item: any, index: any): ReactElement => (
                                  <div key={`notification-${index}`}>
                                    <div className={`bg-unseen notifications-list-item `}>
                                      <>
                                        <div className="status-notification">
                                          <span className="item-status-notification">
                                            {item?.deleted_at !== null
                                              ? 'キャンセルされました'
                                              : '内容が変更されました'}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">ご予約者様氏名</span>
                                          <span className="notifications-list-element-value">{`${item?.name}様`}</span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">サービス </span>
                                          <span className="notifications-list-element-value">
                                            {serviceItems[item?.service_id - 1]?.label}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">予約日時</span>
                                          <span className="notifications-list-element-value">{`${convertDateMatching(
                                            item?.date,
                                          )} ${hourArrayItems[item?.start_time - 1]?.title}〜${
                                            hourArrayItems[item?.end_time]?.title
                                          }`}</span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">最寄駅</span>
                                          <span className="notifications-list-element-value">
                                            {item?.station || 'なし'}
                                          </span>
                                        </div>
                                        <div className="notifications-list-element">
                                          <span className="notifications-list-element-field">指名</span>
                                          <span className="notifications-list-element-value">{user?.name}</span>
                                        </div>
                                        <div className="notifications-list-element ">
                                          <span className="notifications-list-element-field">備考</span>
                                          <span className="notifications-list-element-value">
                                            {item?.request_description ?? ''}
                                          </span>
                                        </div>

                                        {item?.deleted_at !== null ? (
                                          <div className="notifications-list-element ">
                                            <span className="notifications-list-element-field">理由</span>
                                            <span className="notifications-list-element-value ">
                                              {item?.reason || 'なし'}
                                            </span>
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                      </>
                                    </div>
                                  </div>
                                ),
                              )
                            : ''}
                        </div>
                      </>
                    ) : (
                      <div className="empty-item">
                        <span className="data-empty">担当する依頼に関する更新情報はありません</span>
                      </div>
                    )}
                  </Spin>
                </Panel>
              </Collapse>

              {/* LIST CALENDAR  */}
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel header={headerCollapseCalendars()} key="2">
                  <div>
                    {castJobCurrentDate?.length !== 0 && castJobCurrentDate !== undefined ? (
                      castJobCurrentDate?.map((item: any, index: any) => (
                        <div className="calendar-list" key={`calender${index}`}>
                          <div className={`${item?.deleted_at !== null ? 'overlay' : ''}`}></div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">ご予約者様氏名</span>
                            <span className="calendar-list-element-value">{`${item?.name}様` || 'なし'}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">サービス</span>
                            <span className="calendar-list-element-value">
                              {serviceItems[item?.service_id - 1]?.label}
                            </span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">予約日時</span>
                            <span className="calendar-list-element-value">{`${convertDateMatching(item?.date)} ${
                              hourArrayItems[item?.start_time - 1]?.title
                            } ~ ${hourArrayItems[item?.end_time]?.title}`}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">最寄駅</span>
                            <span className="calendar-list-element-value">{item?.station || 'なし'}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">最寄駅</span>
                            <span className="calendar-list-element-value">
                              {`〒${formatPostalCode(item?.postal_code)}`}
                              <br />
                              {item?.province} {item?.street} {item?.city}
                            </span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">指名</span>
                            <span className="calendar-list-element-value">{item?.name || 'なし'}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">備考</span>
                            <span className="calendar-list-element-value">{item?.request_description || 'なし'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-item">
                        <span className="data-empty">本日のご依頼ステータスはありません</span>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>

              {/* LIST REQUEST */}
              <Collapse
                onChange={handleShowPagination}
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : '')}
                expandIconPosition="end"
              >
                <Panel
                  header={headerCollapseDetails()}
                  collapsible={'header'}
                  key="3"
                  extra={
                    <Dropdown
                      getPopupContainer={() => {
                        let castPage: any = document.body.getElementsByClassName('ant-collapse-extra');
                        return castPage[0];
                      }}
                      className={`cast-job-page ${!showPagination ? 'hidden' : ''} `}
                      menu={{ items: itemPage, onClick: handleJobDropdown }}
                      overlayClassName="dropdown-cast-job"
                      trigger={['click']}
                      placement={'bottom'}
                    >
                      <Space>
                        <div className="cast-job-btn">
                          <span>{page !== null ? (page ? `${page}件表示` : '全て表示') : '10件表示'}</span>
                          <CaretDownOutlined />
                        </div>
                      </Space>
                    </Dropdown>
                  }
                >
                  <div className="request-list">
                    {listCastMatching?.length !== 0 && listCastMatching !== undefined ? (
                      <Spin spinning={listJobLoading}>
                        {listCastMatching?.map((item: any, index: any) => (
                          <div
                            key={`request-${item?.id}`}
                            className={`${index % 2 === 0 ? 'bg-item-new' : ''} request-list-element`}
                            onClick={(): void => handleRead(item?.id, item?.status_seen)}
                          >
                            <div>
                              <Space>
                                <Badge dot={(item?.status_seen === 0 || item?.status_seen === 2) && show}>
                                  <span className="date">{convertDateMatching(item?.date)}</span>
                                  <span className="name-rq"> {`${item?.name}様`}</span>
                                </Badge>
                              </Space>

                              <span className="arrow-right">
                                <img src={images.iconRequestList} alt="" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </Spin>
                    ) : (
                      <div className="empty-item">
                        <span className="data-empty">ご依頼内容詳細はありません</span>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="content-bot">
              <div className="bot-element">
                <div className="account-setting-element custom-setting">
                  <span className="icon">
                    <img src={images.iconSetting} alt="Error" />
                  </span>
                  <span className="detail">各種設定</span>
                </div>

                <div
                  className="account-setting-element"
                  onClick={(): void => {
                    navigate(config.routes.castSchedule);
                  }}
                >
                  <span className="icon">
                    <img src={images.iconCalendarCast} alt="Error" />
                  </span>
                  <span className="detail">シフト確認・登録</span>
                  <span className="arrow-right">
                    <img src={images.iconArrowRight} alt="Error" />
                  </span>
                </div>

                <div
                  className="account-setting-element"
                  onClick={(): void => {
                    navigate(config.routes.castInformation);
                  }}
                >
                  <span className="icon">
                    <img src={images.iconInforCast} alt="Error" />
                  </span>
                  <span className="detail">会員情報の確認・変更</span>
                  <span className="arrow-right">
                    <img src={images.iconArrowRight} alt="Error" />
                  </span>
                </div>
                <div
                  className="account-setting-element"
                  onClick={(): void => {
                    navigate(config.routes.castQuestion);
                  }}
                >
                  <span className="icon">
                    <img src={images.iconQuestion} alt="Error" />
                  </span>
                  <span className="detail">お問い合わせ</span>
                  <span className="arrow-right">
                    <img src={images.iconArrowRight} alt="Error" />
                  </span>
                </div>
              </div>
            </div>
            <div className="btn-account-setting">
              <button className="btn btn-custom" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          </div>
          <div className="background-mypage">
            <img src={images.iconMyPage} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CastDashboard;
