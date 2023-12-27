import { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { customerApi } from '../../../../api/customerApi/customerApi';
import { getLocalStorage } from '../../../../helper/common';
import { timeValue } from '../../../../utils/timeValue';
import { dayItems } from '../../../../utils/dayItems';
import config from '../../../../config';

export default function CustomerConfirmHearing(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  // GET DATA LOCAL
  const hearingData = getLocalStorage('dataHearingSubmit');

  // HOOK EFFECT
  useEffect((): void => {
    if (!hearingData || hearingData[0]?.time === '' || hearingData[1]?.time === '' || hearingData[2]?.time === '') {
      navigate(config.routes.customerHearing);
      localStorage.removeItem('dataHearingSubmit');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CONFIG STRING FOR DATE
  const configString: any = (date: string): string => {
    let dateConvert: Date = new Date(date);
    return `${dateConvert.getFullYear()}年${dateConvert.getMonth() + 1}月${dateConvert.getDate()}日（${
      dayItems[dateConvert?.getDay()]
    }）`;
  };

  // HANDLE SUBMIT
  const onSubmit = async (): Promise<void> => {
    try {
      let res: any = await customerApi.registerHearing(hearingData);
      if (res && res.status + '' === 'success') {
        localStorage.removeItem('dataHearingSubmit');
        navigate(config.routes.customerHearingSuccess);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="none-border hearing-confirm-title">
        <h2 className="item-title-hearing">入力情報確認</h2>
      </div>
      <div className="container-630 confirm-hearing-container">
        <div className="content">
          <div className="menu-content">
            <div className="item-content-confirm">
              {hearingData &&
                hearingData?.map((item: any, index: any) => {
                  return (
                    <div className="item-confirm" key={index}>
                      <p>第{index + 1}希望</p>
                      <div className="confirm-description">
                        <span>
                          日時: {configString(hearingData[index]?.date)} {timeValue[hearingData[index]?.time - 1]}
                        </span>
                        <span>形態: {hearingData[index]?.typeof === 1 ? 'ご訪問' : 'リモート'}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="block-btn-info">
              <button className="btn" onClick={() => navigate(config.routes.customerHearing)}>
                内容を変更
              </button>
              <button className="btn btn-new cr-allow" onClick={onSubmit}>
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
