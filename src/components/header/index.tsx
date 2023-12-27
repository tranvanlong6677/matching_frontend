import { Badge, Drawer } from 'antd';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { setShowDrawer } from '../../redux/services/customerSlice';
import image, { images } from '../../assets/images/index';
import { logout } from '../../redux/services/authSlice';
import config from '../../config';
import ModalSuccess from '../modalSuccess/modalSuccess';
import { getLocalStorage } from '../../helper/common';

export default function Header(): JSX.Element {
  const location: Location = useLocation();
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const statusEkyc = getLocalStorage('ekstt');

  // GET HEIGHT POSITION
  let wrapperHeight = document.getElementsByClassName('wrapper')[0]?.clientHeight;
  let headerHeight = document.getElementsByClassName('header-container-client')[0]?.clientHeight;

  // HOOK STATE
  const [isUser, setIsUser]: [boolean | undefined, React.Dispatch<any>] = useState<boolean>();
  const [isShowNotificationSurvey, setIsShowNotificationSurvey]: [boolean, React.Dispatch<any>] =
    useState<boolean>(false);
  const [showChangeWarning, setShowChangeWarning]: any = useState(false);
  const [modalType, setModalType] = useState({
    KYC: false,
    hearing: false,
    type: '',
  });

  // REDUCERS
  const {
    matchingComplete,
    showDrawer,
    // statusEkycRedux: statusEkyc,
  } = useSelector((state: any) => state.customerReducer);

  // HOOK EFFECT
  useEffect(() => {
    dispatch(setShowDrawer(false));
    if (location?.pathname?.includes('/user/')) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (isUser) {
      setIsShowNotificationSurvey(matchingComplete?.find((item: any) => +item.status === 0) !== undefined);
    }
  }, [matchingComplete, isUser]);

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout());
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      if (isUser) {
        navigate(config.routes.logoutCustomer);
      } else {
        navigate(config.routes.logoutCast);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  // HEADER STYLES
  const headerStyle: React.CSSProperties = {
    backgroundColor: 'rgb(217, 200, 161, 0.2)',
    padding: '16px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  // BODY STYLES
  const bodyStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgb(217, 200, 161, 0.2)',
  };

  // WRAPPER STYLES
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    height: `${wrapperHeight - headerHeight}px`,
    boxShadow: 'none',
  };

  // DRAWER STYLES
  const drawerStyle = {
    transform: 'translateX(0%)', // Điểm bắt đầu trượt của Drawer, ở đây là 100% width từ phải
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
    // return true;
  };

  return (
    <header className="header-container-client">
      <img src={images.iconLogo} alt="Error" className="logo-client" />
      <ModalSuccess
        KYC={modalType.KYC}
        hearing={modalType.hearing}
        type={modalType.type}
        showChangeWarning={showChangeWarning}
        setShowChangeWarning={setShowChangeWarning}
        statusEkyc={statusEkyc}
      />
      {showDrawer ? (
        <img
          src={image.iconClose}
          alt="Error"
          className="icon-menu-client"
          onClick={() => {
            dispatch(setShowDrawer(false));
          }}
        />
      ) : (
        <img
          src={image.iconMenuHeader}
          alt="Error"
          className="icon-menu-client"
          onClick={() => {
            dispatch(setShowDrawer(true));
          }}
        />
      )}
      {showDrawer && (
        <Drawer
          getContainer={(): any => {
            return document.getElementsByClassName('drawer-wrapper')[0];
          }}
          closeIcon={<></>}
          placement={'right'}
          width={'100%'}
          size="large"
          onClose={() => dispatch(setShowDrawer(false))}
          open={showDrawer}
          headerStyle={headerStyle}
          contentWrapperStyle={wrapperStyle}
          bodyStyle={bodyStyle}
          forceRender={true}
          keyboard={true}
          maskClosable={true}
          mask={true}
          drawerStyle={drawerStyle}
          zIndex={10000}
        >
          <div className="customer-dashboard-block container-680">
            <div className="content-bot">
              {isUser ? (
                <>
                  <div
                    className="account-setting-element"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      if (handleEkycAndHearing()) {
                        navigate(config.routes.customerBooking);
                      }
                    }}
                  >
                    <span className="icon">
                      <img src={image.infoIcon} alt="" />
                    </span>
                    <span className="detail">予約内容詳細</span>
                    <span className="arrow-right">
                      <img src={image.iconRequestList} alt="" />
                    </span>
                  </div>

                  <div
                    className="account-setting-element"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      if (handleEkycAndHearing()) {
                        navigate(config.routes.customerScheduleService);
                        localStorage.removeItem('srv');
                        localStorage.removeItem('cast');
                        localStorage.removeItem('cse');
                      }
                    }}
                  >
                    <span className="icon">
                      <img src={image.iconCalendarCast} alt="" />
                    </span>
                    <span className="detail">依頼予約</span>
                    <span className="arrow-right">
                      <img src={image.iconRequestList} alt="" />
                    </span>
                  </div>

                  <div
                    className="account-setting-element"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      if (handleEkycAndHearing()) {
                        navigate(config.routes.customerInformation);
                      }
                    }}
                  >
                    <span className="icon">
                      <img src={image.iconInforCast} alt="" />
                    </span>
                    <span className="detail">会員情報の確認・変更</span>
                    <span className="arrow-right">
                      <img src={image.iconRequestList} alt="" />
                    </span>
                  </div>

                  <div
                    className="account-setting-element"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      if (handleEkycAndHearing()) {
                        navigate(config.routes.customerRequestHistory);
                      }
                    }}
                  >
                    <span className="icon">
                      <img src={image.iconClock} alt="" />
                    </span>
                    <span className="detail">依頼履歴</span>
                    <span className="arrow-right">
                      <img src={image.iconRequestList} alt="" />
                    </span>
                  </div>

                  <div
                    className="account-setting-element"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      if (handleEkycAndHearing()) {
                        navigate(config.routes.customerQuestions);
                      }
                    }}
                  >
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

                  <a
                    style={{ display: 'block' }}
                    href="https://forms.gle/LzVtShsJsF4qGMgx5"
                    className="account-setting-element"
                    onClick={(e) => {
                      if (!handleEkycAndHearing()) {
                        dispatch(setShowDrawer(false));
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="icon">
                      <img src={''} alt="" style={{ opacity: 0 }} />
                    </span>
                    <span className="detail" style={{ color: '#000' }}>
                      お問い合わせ
                    </span>
                    <span className="arrow-right">
                      <img src={image.iconRequestList} alt="" />
                    </span>
                  </a>
                  <div
                    className="account-setting-element-navigate"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      navigate(config.routes.customerDashboard);
                    }}
                  >
                    <span className="detail">マイページ TOPへ戻る</span>
                  </div>
                  <div
                    className="account-setting-element-navigate"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      localStorage.removeItem('srv');
                      localStorage.removeItem('cast');
                      localStorage.removeItem('cse');
                    }}
                  >
                    <Link className="detail" to="https://stg.epais.co.jp/">
                      サービスサイト TOPへ戻る
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="account-setting-element"
                    onClick={(): void => {
                      dispatch(setShowDrawer(false));
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
                      dispatch(setShowDrawer(false));
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
                      dispatch(setShowDrawer(false));
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
                  <div
                    className="account-setting-element-navigate"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                      navigate(config.routes.castDashboard);
                    }}
                  >
                    <span>マイページ TOPへ戻る</span>
                  </div>

                  <div
                    className="account-setting-element-navigate"
                    onClick={() => {
                      dispatch(setShowDrawer(false));
                    }}
                  >
                    <Link className="detail" to="https://stg.epais.co.jp/">
                      サービスサイト TOPへ戻る
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="btn-account-setting">
              <button className="btn cr-allow" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </header>
  );
}
