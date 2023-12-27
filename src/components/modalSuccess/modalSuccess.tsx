/* eslint-disable jsx-a11y/anchor-is-valid */
import { Modal, notification } from 'antd';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import images from '../../assets/images/index';
import config from '../../config';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { extendMatching, getBookings, getStatusEkyc } from '../../redux/services/customerSlice';
import { alertFail, alertSuccess } from '../../helper/common';
import { customerApi } from '../../api/customerApi/customerApi';

export default function ModalSuccess({
  KYC,
  hearing,
  type = 'primary',
  cast = false,
  showChangeWarning,
  setShowChangeWarning,
  idBookingMatchDelete,
  idBookingMatchUpdate,
  isUserUpdateBooking,
  statusEkyc,
}: any) {
  const { matchingId }: any = useParams();
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();
  const classNameKycHearing = KYC || hearing ? 'kyc-hearing-modal-success-wrapper' : '';
  const classNameKycHearingPrimary = KYC && type === 'second' ? 'kyc-hearing-modal-success-second-wrapper' : '';
  // TEXT DEFAULT
  let first_text: any;
  let second_text: any;
  let button_text: string = '';

  if (!!KYC) {
    // modal 1
    if (type === 'primary') {
      first_text = '本人認証が必要です';
      second_text = 'コチラより登録ください';
      button_text = '本人認証はこちら';
    }
    // modal 3
    if (type === 'second') {
      first_text = (
        <>
          本人認証が完了していないため <br />
          サービスの利用が限定されています。
        </>
      );
      second_text = (
        <>
          本人認証が完了していない場合、 <br />
          依頼予約などの各サービスを
          <br />
          ご利用いただけくことができません。 <br />
          本人認証が完了するまでお待ちください。
        </>
      );
    }
    if (type === 'sixth') {
      first_text = (
        <>
          初回ヒアリングが完了していないため
          <br />
          サービスの利用が限定されています。
        </>
      );
      second_text = (
        <>
          初回ヒアリングが完了していない場合、
          <br />
          依頼予約などの各サービスを
          <br />
          ご利用いただけくことができません。
          <br />
          初回ヒアリングが完了するまでお待ち
        </>
      );
    }
  }

  if (type === 'third') {
    first_text = (
      <>
        キャスト指名を頂いた予約の
        <br />
        キャスト変更依頼となります。
        <br />
        皆様とお客様との信頼関係継続のために、
        <br />
        再検討後、次のページヘお進みください。
      </>
    );
    second_text = (
      <>
        ※サービス提供日の8日前のため、
        <br />
        キャスト規定に記載の違約金等は発生いたしません。
      </>
    );
  }
  if (type === 'fourth') {
    first_text = (
      <>
        サービス提供日7日前を超えての
        <br />
        キャスト変更依頼となり、
        <br />
        規約に基づきキャスト変更料が発生します。
        <br />
        また、キャスト指名を頂いた予約の為
        <br />
        皆様とお客様との信頼関係継続のために、
        <br />
        再検討後、次のページヘお進みください。
      </>
    );
    second_text = '';
  }
  if (type === 'fifth') {
    first_text = (
      <>
        サービス提供日7日前を超えての
        <br />
        キャスト変更依頼となります。
        <br />
        規約に基づきキャスト変更料が発生しますが、
        <br />
        よろしいですか？
      </>
    );
    second_text = '';
  }
  if (type === 'delete_booking') {
    first_text = (
      <>
        お客様のご予約は前日の19時を過ぎております。
        <br />
        そのため、ご予約のキャンセル・日時変更は、
        <br />
        キャンセル料が発生いたします。
      </>
    );
    button_text = '閉じる';
  }
  if (type === 'update_booking') {
    first_text = (
      <>
        1時間の延長料金が発生いたします。
        <br />
        ご利用を延長される場合は下のボタンを
        <br />
        押してください。
      </>
    );
    button_text = '閉じる';
  }
  // modal 2
  if (!!hearing) {
    if (type === 'primary') {
      first_text = '初回ヒアリング予約が必要です';
      second_text = 'コチラより予約にお進みください';
      button_text = '初回ヒアリング予約';
    }
  }
  if (type === 'coupon') {
    first_text = (
      <>
        1時間の延長料金が発生いたします。
        <br />
        ご利用を延長される場合は下のボタンを
        <br />
        押してください。
      </>
    );
    button_text = '同意して次へ';
  }

  const handleOk = (): void => {
    setShowChangeWarning(false);
  };

  const handleCancel = (): void => {
    setShowChangeWarning(false);
  };

  const modalSetting: any = {
    footer: false,
    centered: true,
    closable: false,
    className: 'modal-emotion',
  };

  // HANDLE EXTEND TIME

  const handleExtendTime = async (): Promise<void> => {
    try {
      const res = await dispatch(extendMatching(idBookingMatchUpdate));
      if (res?.payload?.status === 'success') {
        alertSuccess(api, 'サービス時間延長ができました');
        dispatch(getBookings());
      } else {
        alertFail(api, 'サービス時間延長ができませんでした。');
      }
    } catch (e) {
      alertFail(api, 'サービス時間延長ができませんでした。');
    }
  };

  const handleEkyc = async () => {
    if (statusEkyc) {
      if (KYC && statusEkyc?.status_ekyc === 0) {
        try {
          const res: any = await customerApi.requestEKYC();
          if (res.status === 'success') {
            alertSuccess(api, 'Check mail');
            setShowChangeWarning(false);
            dispatch(getStatusEkyc());
          }
          if (res.code === 400 && res?.message === 'Currently not working. Please try again later') {
            alertFail(api, 'ただいまご利用いただけません。後でもう一度お試しください。');
          }
        } catch (error) {
          alertFail(api, 'Fail');
        }
      } else {
        alertFail(api, 'Fail');
      }

      if (hearing) {
        navigate(config.routes.customerHearing);
      }
    }
  };

  return (
    <>
      {showPopup}
      <div className={`emotion-modal customer-verify `}>
        <Modal open={showChangeWarning} onOk={handleOk} onCancel={handleCancel} {...modalSetting}>
          <div
            className={
              type === 'delete_booking' || type === 'update_booking'
                ? `modal-container-emotion delete-booking-container ${classNameKycHearing} ${classNameKycHearingPrimary}`
                : `modal-container-emotion ${classNameKycHearing}  ${classNameKycHearingPrimary}`
            }
          >
            <div className="icon-modal">
              {KYC || hearing ? <></> : <img src={cast ? images.iconWarning : images.iconSad} alt="" />}
            </div>
            <div className={`text-emotion-description ${cast ? 'cast-item' : 'customer-item'}`}>
              <h2 className="text-emotion-first ">{first_text}</h2>
              {second_text === '' ? '' : <p className={'text-emotion-second'}>{second_text}</p>}
            </div>
            {(type === 'delete_booking' || type === 'update_booking' || type === 'coupon') && (
              <div className="delete-booking-btn-modal-block">
                <button
                  className="btn btn-cs-new btn-booking-custom"
                  onClick={() => {
                    if (type === 'delete_booking') {
                      navigate(`/user/mypage/reserve/select/${idBookingMatchDelete}/cancel`);
                    }
                    if (type === 'coupon') {
                      setShowChangeWarning(false);
                    }
                    if (type === 'update_booking') {
                      handleExtendTime();
                      setShowChangeWarning(false);
                    }
                  }}
                >
                  同意して次へ
                </button>
                <>
                  <span>キャンセル及び変更に関する注意点は</span>
                  <a href="#" className="underline">
                    コチラ
                  </a>
                </>
              </div>
            )}
            <div className="btn-bottom-emotion">
              {type === 'primary' ? (
                <button onClick={handleEkyc} className="btn-confirm-modal btn btn-large btn-cs-new">
                  {button_text}
                </button>
              ) : (
                <div></div>
              )}
              {type === 'third' || type === 'fourth' || type === 'fifth' ? (
                <>
                  <button
                    className="btn btn-yellow block-modal-btn btn-cs-new"
                    onClick={(): void => {
                      navigate(`${config.routes.castChangeSchedule}/${matchingId}/applicate`);
                    }}
                  >
                    同意して次へ
                  </button>
                  <span className="detail-verify">
                    キャンセル及び変更に関する注意点は<a href="#">コチラ</a>
                  </span>
                </>
              ) : (
                ''
              )}
              <button
                className="btn btn-small btn-check"
                onClick={(): void => {
                  if (type === 'third' || type === 'fourth' || type === 'fifth') {
                    setShowChangeWarning(false);
                  }
                  if (type === 'delete_booking' || type === 'update_booking') {
                    setShowChangeWarning(false);
                  }
                  if (type === 'coupon') {
                    setShowChangeWarning(false);
                  }
                  if (KYC) {
                    setShowChangeWarning(false);
                  }
                  if (hearing) {
                    setShowChangeWarning(false);
                  }
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
