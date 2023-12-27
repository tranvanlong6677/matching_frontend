import { Button, notification } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import iconArrowNextStep from '../../../../assets/images/mockup/iconArrowNextStep.svg';
import { alertFail, alertSuccess, getLocalStorage } from '../../../../helper/common';
import { customerApi } from '../../../../api/customerApi/customerApi';
import config from '../../../../config';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { getStatusEkyc } from '../../../../redux/services/customerSlice';

const CustomerWelcome = ({ statusEkyc }: any) => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const [api, showPopup]: any = notification.useNotification();

  // GET DATA LOCAL
  const user = getLocalStorage('user');

  const { loadingEkyc } = useSelector((state: any) => state.customerReducer);

  // HANDLE REQUEST EKYC
  const handleRequestEKYC = async (): Promise<void> => {
    if (statusEkyc?.status_ekyc === 0) {
      try {
        const res: any = await customerApi.requestEKYC();

        if (res.status === 'success') {
          alertSuccess(api, 'Check mail');
          dispatch(getStatusEkyc());
        }
        if (res.code === 400 && res?.message === 'Currently not working. Please try again later') {
          alertFail(api, 'ただいまご利用いただけません。後でもう一度お試しください。');
        }
      } catch (error) {
        alertFail(api, 'Fail');
      }
    }
  };

  const resultEkycStatus = (): string => {
    let result = ' not-allowed';
    if (statusEkyc?.status_ekyc === 0) {
      result = ' active';
    }

    if (statusEkyc?.status_ekyc === 1) {
      result = ' not-allowed';
    }

    if (statusEkyc?.status_ekyc === 2) {
      result = ' not-allowed';
    }
    return result;
  };

  const resultHearingStatus = () => {
    let result = ' not-allowed';

    if (statusEkyc?.status_hearing === 0 && statusEkyc?.status_ekyc === 2) {
      result = ' active';
    }

    if (statusEkyc?.status_hearing === 1) {
      result = ' not-allowed';
    }

    return result;
  };

  return (
    <div
      className={`screen21ft-container${
        statusEkyc?.status_ekyc === 2 && statusEkyc?.status_hearing === 2 ? ' hidden' : ''
      }`}
    >
      {showPopup}
      <div className={`first-time `}>
        <h1 className="greeting">{`ようこそ ${user?.name} さま`}</h1>
        <p className="instruct">
          はじめてのご利用の方は最初に
          <br />
          「本人認証」の登録を行ってください
          <br />
          安全にサービスを提供するために、
          <br />
          本人認証を実施しております。
        </p>
        {loadingEkyc ? (
          ''
        ) : (
          <Button className={`btn verification${resultEkycStatus()}`} onClick={handleRequestEKYC}>
            本人認証はこちら
          </Button>
        )}
        <img src={iconArrowNextStep} alt="" className="arrow" />
        <p className="instruct-2">
          お客様のご依頼、ご希望を確認し、
          <br />
          どのようなサポートができるかを確認するため、
          <br />
          初めてサービスを利用されるお客様には、
          <br />
          ヒアリングをさせていただきます。
        </p>

        <Button
          className={`btn reserve ${resultHearingStatus()}`}
          onClick={(): void => {
            if (resultHearingStatus() === ' active') {
              navigate(config.routes.customerHearing);
            }
          }}
        >
          初回ヒアリング予約
        </Button>
        <span className="attention">※ 本人認証・ヒアリング予約は必須とさせていただきます</span>
      </div>
    </div>
  );
};

export default CustomerWelcome;
