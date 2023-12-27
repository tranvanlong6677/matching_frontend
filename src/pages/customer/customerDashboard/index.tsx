import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Collapse, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';

import { formatCash, getLocalStorage } from '../../../helper/common';
import CustomerWelcome from '../../../modules/customer/customerDashboard/customerWelcome';
import { logout } from '../../../redux/services/authSlice';
import { getCurrentMatching, getMatchingCompleteCustomer, getStatusEkyc } from '../../../redux/services/customerSlice';
import { serviceItems } from '../../../utils/customerServiceItems';
import { hourArrayItems } from '../../../utils/hourArrayItems';

import image, { images } from '../../../assets/images/index';
import config from '../../../config';
import ModalSuccess from '../../../components/modalSuccess/modalSuccess';
import { antIcon } from '../../../App';

const { Panel }: any = Collapse;

export default function CustomerDashboard(): JSX.Element {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // HOOK STATE
  const [isShowCalendar, setIsShowCalendar]: [boolean, React.Dispatch<any>] = useState(false);
  const [isShowNotificationSurvey, setIsShowNotificationSurvey]: any = useState<boolean>(false);
  const [showChangeWarning, setShowChangeWarning]: any = useState(false);
  const [modalType, setModalType] = useState({
    KYC: false,
    hearing: false,
    type: '',
  });
  const [loading, setLoading] = useState(true);

  // GET DATA LOCAL
  const user = getLocalStorage('user');
  const statusEkyc = getLocalStorage('ekstt');

  const { listCurrentMatching, matchingComplete } = useSelector((state: any) => state.customerReducer);

  // DISPATCH GET CURRENT MATCHING
  useEffect((): void => {
    dispatch(getMatchingCompleteCustomer());
    dispatch(getCurrentMatching());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (statusEkyc?.status_ekyc !== 2 || statusEkyc?.status_hearing !== 2 || statusEkyc === null) {
      dispatch(getStatusEkyc());
    }
  }, []);

  useEffect((): void => {
    setIsShowNotificationSurvey(matchingComplete?.find((item: any): boolean => +item.status === 0) !== undefined);
  }, [matchingComplete]);

  // HEADER COLLAPSE
  const headerCollapse = () => (
    <div
      className="account-setting-element account-setting-element-calendar"
      onClick={(): void => {
        setIsShowCalendar(!isShowCalendar);
      }}
    >
      <span className="icon calendar">
        <img src={image.iconCalendar} alt="Error" />
      </span>
      <span className="detail">本日の予約ステータス</span>
    </div>
  );

  // HANDLE LOGOUT
  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate(config.routes.logoutCustomer);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  const handleEkycAndHearing = () => {
    if (statusEkyc?.status_ekyc === 0 && statusEkyc?.status_hearing === 0) {
      setModalType({
        KYC: true,
        hearing: false,
        type: 'primary',
      });
      setShowChangeWarning(true);
      return false;
    }
    if (statusEkyc?.status_ekyc === 1 && statusEkyc?.status_hearing === 0) {
      setModalType({
        KYC: true,
        hearing: false,
        type: 'second',
      });
      setShowChangeWarning(true);
      return false;
    }
    if (statusEkyc?.status_ekyc === 2 && statusEkyc?.status_hearing === 0) {
      setModalType({
        KYC: false,
        hearing: true,
        type: 'primary',
      });
      setShowChangeWarning(true);
      return false;
    }
    if (statusEkyc?.status_ekyc === 0 && statusEkyc?.status_hearing === 2) {
      setModalType({
        KYC: true,
        hearing: false,
        type: 'primary',
      });
      setShowChangeWarning(true);
      return false;
    }
    if (statusEkyc?.status_ekyc === 2 && statusEkyc?.status_hearing === 1) {
      setModalType({
        KYC: true,
        hearing: false,
        type: 'sixth',
      });
      setShowChangeWarning(true);
      return false;
    }
    if (statusEkyc?.status_ekyc === 2 && statusEkyc?.status_hearing === 2) {
      setModalType({
        KYC: false,
        hearing: false,
        type: '"',
      });
      return true;
    }
  };

  const handleCustomerBooking = () => {
    if (handleEkycAndHearing()) {
      navigate(config.routes.customerBooking);
    }
  };

  const handleCustomerScheduleService = () => {
    if (handleEkycAndHearing()) {
      navigate(config.routes.customerScheduleService);
    }
  };

  const handleCustomerRequestHistory = () => {
    if (handleEkycAndHearing()) {
      navigate(config.routes.customerRequestHistory);
    }
  };

  const handleCustomerQuestion = () => {
    if (handleEkycAndHearing()) {
      navigate(config.routes.customerQuestions);
    }
  };

  const handleCustomerInformation = () => {
    if (handleEkycAndHearing()) {
      navigate(config.routes.customerInformation);
    }
  };

  if (loading && statusEkyc === null) {
    return (
      <div className="loading-spinner">
        <Spin indicator={antIcon} />
      </div>
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="container-680">
          <div className="customer-dashboard-block">
            <div className="content-top">
              <div className="account-setting-element name">
                <img className="icon" src={image.iconUser} alt="Error" />
                <div className="detail">
                  <span className="detail-name">{user?.name}</span>
                  <span className="detail-email">{user?.email}</span>
                </div>
              </div>
              <CustomerWelcome statusEkyc={statusEkyc} />
              <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel header={headerCollapse()} key="">
                  {listCurrentMatching?.length !== 0 && listCurrentMatching !== undefined ? (
                    <>
                      {listCurrentMatching?.map((item: any, index: any) => (
                        <div className={`calendar-list`} key={index}>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">サービス</span>
                            <span className="calendar-list-element-value">
                              {item?.service_id ? serviceItems[item?.service_id - 1]?.label : ''}
                            </span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">予約日時</span>
                            <span className="calendar-list-element-value">{`${convertDate(item?.date)} ${
                              hourArrayItems[item?.start_time - 1]?.title
                            } ~ ${hourArrayItems[item?.end_time]?.title}`}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">依頼時間</span>
                            <span className="calendar-list-element-value">{item?.hour ? `${item?.hour}時間` : ''}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">概算料金</span>
                            <span className="calendar-list-element-value">{`¥${
                              item?.price ? formatCash(item?.price?.toString()) : ''
                            }`}</span>
                          </div>
                          <div className="calendar-list-element">
                            <span className="calendar-list-element-field">合計金額</span>
                            <span className="calendar-list-element-value">{`¥${
                              item?.price ? formatCash(item?.price?.toString()) : ''
                            }`}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="empty-item">
                      <span className="data-empty">ご依頼内容詳細はありません</span>
                    </div>
                  )}
                </Panel>
              </Collapse>
            </div>
            <div className="content-bot">
              <div className="account-setting-element">
                <span className="icon">
                  <img src={image.iconSetting} alt="" />
                </span>
                <span className="detail">各種設定</span>
              </div>

              <div className="account-setting-element" onClick={handleCustomerBooking}>
                <span className="icon">
                  <img src={image.infoIcon} alt="" />
                </span>
                <span className="detail">予約内容詳細</span>
                <span className="arrow-right">
                  <img src={image.iconRequestList} alt="" />
                </span>
              </div>

              <div className="account-setting-element" onClick={handleCustomerScheduleService}>
                <span className="icon">
                  <img src={image.iconCalendarCast} alt="" />
                </span>
                <span className="detail">依頼予約</span>
                <span className="arrow-right">
                  <img src={image.iconRequestList} alt="" />
                </span>
              </div>

              <div className="account-setting-element" onClick={handleCustomerInformation}>
                <span className="icon">
                  <img src={image.iconInforCast} alt="" />
                </span>
                <span className="detail">会員情報の確認・変更</span>
                <span className="arrow-right">
                  <img src={image.iconRequestList} alt="" />
                </span>
              </div>

              <div className="account-setting-element" onClick={handleCustomerRequestHistory}>
                <span className="icon">
                  <img src={image.iconClock} alt="" />
                </span>
                <span className="detail">依頼履歴</span>
                <span className="arrow-right">
                  <img src={image.iconRequestList} alt="" />
                </span>
              </div>

              <div className="account-setting-element" onClick={handleCustomerQuestion}>
                <Badge dot={isShowNotificationSurvey}>
                  <span className="icon">
                    <img src={image.iconStar} alt="" />
                  </span>
                  <span className="detail">アンケート</span>
                </Badge>
                <span className="arrow-right arrow-right-survey">
                  {isShowNotificationSurvey && <span className="text-notification-survey">*未回答があります</span>}
                  <img src={image.iconRequestList} alt="" />
                </span>
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
      <ModalSuccess
        KYC={modalType.KYC}
        hearing={modalType.hearing}
        type={modalType.type}
        showChangeWarning={showChangeWarning}
        setShowChangeWarning={setShowChangeWarning}
        statusEkyc={statusEkyc}
      />
    </>
  );
}
