import { Form, FormInstance, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import CalendarHearingModal from '../../../modules/customer/customerDashboard/calendarHearingModal';
import { getLocalStorage, setLocalStorage } from '../../../helper/common';
import { hearingItems } from '../../../utils/hearingItems';
import image from '../../../assets/images/index';
import config from '../../../config';

const defaultHearingData: any = [
  {
    id: 1,
    date: '',
    time: '',
    typeof: '',
  },
  {
    id: 2,
    date: '',
    time: '',
    typeof: '',
  },
  {
    id: 3,
    date: '',
    time: '',
    typeof: '',
  },
];

export default function CustomerHearing(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [formHearing]: [FormInstance] = Form.useForm();

  // GET DATA LOCAL
  const hearingDataLocalStorage = getLocalStorage('dataHearingSubmit');

  // HOOK STATE
  const [saveIdHearing, setSaveIdHearing]: any = useState<any>(1);
  const [hearingData, setHearingData]: any = useState<any>(defaultHearingData);
  const [showHearingModal, setShowHearingModal]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [showHearingCalendarModal, setShowHearingCalendarModal]: [boolean, React.Dispatch<any>] =
    useState<boolean>(false);

  // HOOK EFFECT
  useEffect((): void => {
    // trong truong hop back lai tu man confirm,setHearingData tu localStorage
    if (hearingDataLocalStorage !== null) {
      const tmpData: any = {
        date_1: configString(hearingDataLocalStorage[0]?.date),
        date_2: configString(hearingDataLocalStorage[1]?.date),
        date_3: configString(hearingDataLocalStorage[2]?.date),
        typeof_1: hearingDataLocalStorage[0]?.typeof === 1 ? 'ご訪問' : 'リモート',
        typeof_2: hearingDataLocalStorage[1]?.typeof === 1 ? 'ご訪問' : 'リモート',
        typeof_3: hearingDataLocalStorage[2]?.typeof === 1 ? 'ご訪問' : 'リモート',
      };
      formHearing.setFieldsValue(tmpData);
      let hearingDataLocalStorageClone = hearingDataLocalStorage.map((item: any) => {
        const dateConvert: Date = new Date(item?.date);
        return {
          ...item,
          date: {
            day: dateConvert.getDate(),
            month: dateConvert.getMonth() + 1,
            year: dateConvert.getFullYear(),
          },
        };
      });
      setHearingData(hearingDataLocalStorageClone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CONVERT DATE TO STRING
  const configString = (date: string): string => {
    let dateConvert: Date = new Date(date);
    return `${dateConvert.getFullYear()}年${dateConvert.getMonth() + 1}月${dateConvert.getDate()}日`;
  };

  // HANDLE HEARING DATA
  const handleHearingData = (id: number, key: string, value: any, datetimeValue: any): void => {
    const tmpHearingData = hearingData?.map((item: any): any => {
      if (item.id === id) {
        if (value !== undefined && datetimeValue === undefined) {
          return {
            ...item,
            [key]: value.id,
          };
        }
        if (value === undefined && datetimeValue !== undefined) {
          return {
            ...item,
            date: datetimeValue?.date,
            time: datetimeValue?.time,
          };
        }
      } else {
        return {
          ...item,
        };
      }
    });
    setHearingData(tmpHearingData);

    // CHECK VALUE UNDEFINED
    if (!!value) {
      formHearing.setFieldValue(`typeof_${id}`, value?.value);
      let hearingDataClone = hearingData?.map((item: any, index: number): any => {
        if (id === index + 1) {
          return { ...item, typeof: +value?.id };
        } else {
          return { ...item };
        }
      });

      setHearingData(hearingDataClone);
    }

    // CHECK DATETIME VALUE UNDEFINED
    if (!!datetimeValue) {
      const dateConvertString: string = `${datetimeValue?.date?.year}年${datetimeValue?.date?.month}月${datetimeValue?.date?.day}日`;
      formHearing.setFieldValue(`date_${id}`, dateConvertString);
    }

    // SET STATE HEARING DATA
  };

  // SUBMIT
  const onSubmit = (): void => {
    if (checkHearingDataFull(hearingData)) {
      let dataSubmit = hearingData?.map((item: any): any => {
        const monthValue = item?.date?.month < 10 ? `0${item?.date?.month}` : item?.date?.month;
        const dayValue = item?.date?.day < 10 ? `0${item?.date?.day}` : item?.date?.day;
        return {
          date: `${item?.date?.year}-${monthValue}-${dayValue}`,
          time: item?.time,
          typeof: item?.typeof,
          id: item?.id,
        };
      });
      try {
        if (hearingDataLocalStorage) {
          dataSubmit = hearingDataLocalStorage;
          // eslint-disable-next-line array-callback-return
          hearingData.map((item: any, index: any): void => {
            if (item.date !== '') {
              dataSubmit[index].date = `${item?.date?.year}-${item?.date?.month}-${item?.date?.day}`;
            }
            if (item.time !== '') {
              dataSubmit[index].time = item.time;
            }
            if (item.typeof !== '') {
              dataSubmit[index].typeof = item.typeof;
            }
          });
        }
        setLocalStorage('dataHearingSubmit', dataSubmit);
        navigate(config.routes.customerConfirmHearing);
      } catch (error) {}
    }
  };

  // CHECK HEARING DATA FULL
  const checkHearingDataFull = (hearingData: any): boolean => {
    let hearingDataEmpty = hearingData?.find(
      (item: any) => item?.date === '' || item?.time === '' || item?.typeof === '',
    );

    if (hearingDataEmpty) {
      return false;
    }

    return true;
  };
  return (
    <div className="block-reserve-form container-680">
      <Modal
        wrapClassName={'typeof-wrapper'}
        maskStyle={{ pointerEvents: 'none' }}
        open={showHearingModal}
        footer={false}
        className="modal-date"
        title={
          <div>
            <h2 className="head-modal-title">下記から選択してください</h2>
          </div>
        }
        closeIcon={
          <>
            <img src={image.iconClose} alt="" />
          </>
        }
        onCancel={(): void => {
          setShowHearingModal(false);
        }}
      >
        {hearingItems?.map((hearingItem: any) => {
          return (
            <p
              key={hearingItem?.id}
              onClick={(): void => {
                setShowHearingModal(false);
                handleHearingData(saveIdHearing, 'typeof', hearingItem, undefined);
              }}
            >
              {hearingItem.title}
            </p>
          );
        })}
        <p className="typeof-hearing">
          お客様のご依頼、ご希望を確認し、どのようなサポートができるかを確認するため、「ご訪問」の形式を推奨しています。
          <br />
          どうしても難しい場合や、都合がつかない場合は「リモート」をご選択ください。
        </p>
      </Modal>
      <div className="content">
        <div className="menu-content">
          <div className="head-title">
            <h2 className="item-title-hearing">初回ヒアリング予約</h2>
          </div>
          <div className="block-hearing-content">
            <Form form={formHearing} onFinish={onSubmit} autoComplete="off">
              <div className="item-content">
                <div className="item-form">
                  <p>第1希望</p>
                  <div className="form-item-hearing">
                    <div
                      className="form-input-hearing"
                      onClick={(): void => {
                        setShowHearingCalendarModal(true);
                        setSaveIdHearing(1);
                      }}
                    >
                      <Form.Item name="date_1">
                        <Input type="text" name="" className="input-global" placeholder="日時を選択" readOnly />
                      </Form.Item>
                    </div>
                    <div
                      className="form-select-hearing"
                      onClick={(): void => {
                        setShowHearingModal(true);
                        setSaveIdHearing(1);
                      }}
                    >
                      <Form.Item name="typeof_1">
                        <Input className="select-global" placeholder="形態" readOnly />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="item-form">
                  <p>第2希望</p>

                  <div className="form-item-hearing">
                    <div
                      className="form-input-hearing"
                      onClick={(): void => {
                        setShowHearingCalendarModal(true);
                        setSaveIdHearing(2);
                      }}
                    >
                      <Form.Item name="date_2">
                        <Input type="text" name="" className="input-global" placeholder="日時を選択" readOnly />
                      </Form.Item>
                    </div>
                    <div
                      className="form-select-hearing"
                      onClick={(): void => {
                        setShowHearingModal(true);
                        setSaveIdHearing(2);
                      }}
                    >
                      <Form.Item name="typeof_2">
                        <Input className="select-global" placeholder="形態" readOnly />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="item-form">
                  <p>第3希望</p>

                  <div className="form-item-hearing">
                    <div
                      className="form-input-hearing"
                      onClick={(): void => {
                        setShowHearingCalendarModal(true);
                        setSaveIdHearing(3);
                      }}
                    >
                      <Form.Item name="date_3">
                        <Input type="text" name="" className="input-global" placeholder="日時を選択" readOnly />
                      </Form.Item>
                    </div>
                    <div
                      className="form-select-hearing"
                      onClick={(): void => {
                        setShowHearingModal(true);
                        setSaveIdHearing(3);
                      }}
                    >
                      <Form.Item name="typeof_3">
                        <Input className="select-global" placeholder="形態" readOnly />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="text-hearing">
                  <p className="2">
                    上記日程でご希望に沿えない場合には、
                    <br />
                    弊社よりお客様にご連絡いたします。
                    <br />
                    面談のお時間は30分から1時間程度いただきます。
                  </p>
                </div>
              </div>
              <div className="block-btn-reserve d-flex-bw">
                <button
                  className={checkHearingDataFull(hearingData) ? 'btn btn-new cr-allow' : 'btn btn-new not-allowed'}
                  onClick={onSubmit}
                >
                  次へ
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <CalendarHearingModal
        setHearingData={setHearingData}
        showHearingCalendarModal={showHearingCalendarModal}
        setShowHearingCalendarModal={setShowHearingCalendarModal}
        handleHearingData={handleHearingData}
        saveIdHearing={saveIdHearing}
        hearingData={hearingData}
      />
    </div>
  );
}
