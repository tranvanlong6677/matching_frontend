import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { Button, Collapse, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { getHistoryMatching } from '../../../../redux/services/customerSlice';
import { serviceItems } from '../../../../utils/customerServiceItems';
import { hourArrayItems } from '../../../../utils/hourArrayItems';
import { formatCash } from '../../../../helper/common';
import image from '../../../../assets/images/index';
import config from '../../../../config';

const { Panel }: any = Collapse;

const CustomerRequestHistory = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  const { listHistoryMatching, loading } = useSelector((state: any) => state.customerReducer);
  // DISPATCH GET HISTORY MATCHING
  useEffect((): void => {
    dispatch(getHistoryMatching());
  }, [dispatch]);

  // CONVERT DATE
  const convertDate = (date: any): string => {
    return date?.replace(/-/g, '/');
  };

  return (
    <div className="request-history container-680">
      <div className="title">
        <img src={image.iconClock} alt="" />
        <h1>依頼履歴</h1>
      </div>
      {listHistoryMatching?.length === 0 && listHistoryMatching === undefined ? (
        <span className="request-history-empty">依頼履歴はありません</span>
      ) : (
        <div className="list-services">
          <Spin spinning={loading}>
            {!loading && (
              <Collapse
                bordered={false}
                expandIconPosition={'end'}
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
              >
                {listHistoryMatching?.map((item: any, index: any) => {
                  return (
                    <Panel
                      key={index}
                      header={` ${convertDate(item?.date)}  ${
                        item?.service_id ? serviceItems[item?.service_id]?.label : ''
                      }`}
                    >
                      <div className="service-detail">
                        <div className="service-detail-element">
                          <span className="field">時間</span>
                          <span className="value">{`${hourArrayItems[item?.start_time - 1]?.title} ~ ${
                            hourArrayItems[item?.end_time]?.title
                          }`}</span>
                        </div>
                        <div className="service-detail-element">
                          <span className="field">依頼時間 </span>
                          <span className="value">{`${item?.hour ? `${item?.hour}時間` : 'なし'}`}</span>
                        </div>

                        <div className="service-detail-element">
                          <span className="field">担当キャスト</span>
                          <span className="value">{item?.cast_name ?? ''}</span>
                        </div>

                        <div className="service-detail-element">
                          <span className="field">料金</span>
                          <span className="value">
                            {`${item?.price ? `¥${formatCash(item?.price?.toString())}` : 'なし'}`}
                          </span>
                        </div>
                        <div className={'btn-extend'}>
                          <Button
                            onClick={(): void => {
                              navigate(`${config.routes.customerChangeHistory}/${item?.id}`);
                            }}
                            className="btn cr-allow"
                          >
                            再予約
                          </Button>
                        </div>
                      </div>
                    </Panel>
                  );
                })}
                {listHistoryMatching && listHistoryMatching?.length > 0 ? (
                  <span className="note">※ 最新の10件を表示</span>
                ) : (
                  <span className="note-empty">依頼履歴はありません</span>
                )}
              </Collapse>
            )}
          </Spin>
        </div>
      )}

      <div className="block-btn">
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
};

export default CustomerRequestHistory;
