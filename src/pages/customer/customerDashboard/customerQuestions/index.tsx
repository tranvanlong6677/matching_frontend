import React, { useEffect, useState } from 'react';
import image from '../../../../assets/images/index';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import config from '../../../../config';
import { getMatchingCompleteCustomer } from '../../../../redux/services/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { serviceItems } from '../../../../utils/customerServiceItems';
import { Dispatch } from 'redux';

const CustomerQuestions = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const [listMatchingComplete, setListMatchingComplete]: any = useState<any>();
  const { matchingComplete } = useSelector((state: any) => state.customerReducer);

  // HOOK EFFECT
  useEffect((): void => {
    localStorage.removeItem('data_survey_current');
    fetchCompleteMatching();
  }, []);

  useEffect((): void => {
    let matchingCompleteClone = matchingComplete?.map((item: any) => {
      let dateTemplate: Date = new Date(item?.date);
      let dateString: string = `${dateTemplate?.getFullYear()} ${dateTemplate?.getDate()}/${
        dateTemplate?.getMonth() + 1
      }`;
      return {
        ...item,
        dateString: dateString,
        dateFormat: new Date(item?.date),
      };
    });
    matchingCompleteClone?.sort((a: any, b: any) => b?.dateFormat - a?.dateFormat);
    setListMatchingComplete(matchingCompleteClone);
  }, [matchingComplete]);

  const fetchCompleteMatching = async (): Promise<void> => {
    await dispatch(getMatchingCompleteCustomer());
  };

  return (
    <div className="questions-wrapper container-680">
      <div className="questions-title">
        <span className="icon">
          <img src={image.iconStar} alt="" />
        </span>
        <span className="title">アンケート</span>
      </div>

      <div className="questions-list">
        {listMatchingComplete && listMatchingComplete?.length > 0 ? (
          listMatchingComplete?.map((item: any, index: any) => {
            return (
              <div
                className="questions-element"
                key={index}
                onClick={() => navigate(`${config.routes.customerQuestionDetail}/${item?.matching_id}`)}
              >
                <div className="text">
                  <span className="date">{item?.dateString}</span>
                  <span className="question-topic">{`${serviceItems[item?.service_id - 1]?.label}`}</span>
                </div>
                {item?.status === 0 ? (
                  <span className="status status-unanswered">未回答</span>
                ) : (
                  <span className="status">済み</span>
                )}
              </div>
            );
          })
        ) : (
          <span className="empty">回答可能なアンケートはありません</span>
        )}
      </div>
      <div className="button-block">
        <button
          className="btn"
          onClick={(): void => {
            navigate(`${config.routes.customerDashboard}`);
          }}
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default CustomerQuestions;
