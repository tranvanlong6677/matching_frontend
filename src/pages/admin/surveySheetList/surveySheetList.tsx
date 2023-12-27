import { Dispatch } from 'redux';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserSurveyMatching } from '../../../redux/services/adminSlice';
import { serviceItems } from '../../../utils/customerServiceItems';
import { generateOptionsMonth } from '../../../helper/common';
import { Link, useSearchParams } from 'react-router-dom';
import ChartComponent from './chart';
import config from '../../../config';

// GET DATE NOW
const dateNow: Date = new Date();

// GET DEFAULT VALUE SELECT MONTH
const defaultSelectMonthState: string = `${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`;

const SurveySheetList = () => {
  const dispatch: Dispatch = useDispatch();
  let [searchParams, setSearchParams]: any = useSearchParams();

  // HOOK STATE
  const [userSurveyMatchingCsv, setUserSurveyMatchingCsv]: any = useState<any>([]);
  const [listSurveyMatchingChooseQ1_1, setlistSurveyMatchingChooseQ1_1]: any = useState<any>([]);
  const [listSurveyMatchingChooseQ1_2, setlistSurveyMatchingChooseQ1_2]: any = useState<any>([]);
  const [listSurveyMatchingChooseQ1_3, setlistSurveyMatchingChooseQ1_3]: any = useState<any>([]);
  const [defaultValueSelectMonth, setDefaultValueSelectMonth]: any = useState<any>('');

  // GET MONTH NOW
  const month: number = new Date().getMonth() + 1;

  // REDUCER
  const { userSurveyMatching, loading, userSurveyMatchingChart } = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect((): void => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchDataSurvey = async (month: string, year: string): Promise<void> => {
    dispatch(getUserSurveyMatching({ month, year }));
  };

  // HANDLE SEARCH PARAMS
  useEffect((): void => {
    if (!searchParams.get('month') && !searchParams.get('year')) {
      const month: string = (dateNow.getMonth() + 1).toString();
      const year: string = dateNow.getFullYear().toString();
      setSearchParams({
        month: month,
        year: year,
      });
      setDefaultValueSelectMonth(defaultSelectMonthState);
    } else {
      const month: string = searchParams.get('month');
      const year: string = searchParams.get('year');

      setDefaultValueSelectMonth(`${month}-${year}`);
      fetchDataSurvey(month, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // HANDLE DATA CHART
  useEffect((): void => {
    let listChoose1 = userSurveyMatchingChart?.filter((item: any): boolean => item?.q1 === 1);
    let listChoose2 = userSurveyMatchingChart?.filter((item: any): boolean => item?.q1 === 2);
    let listChoose3 = userSurveyMatchingChart?.filter((item: any): boolean => item?.q1 === 3);

    setlistSurveyMatchingChooseQ1_1(listChoose1);
    setlistSurveyMatchingChooseQ1_2(listChoose2);
    setlistSurveyMatchingChooseQ1_3(listChoose3);

    let userSurveyMatchingChartClone = userSurveyMatchingChart?.map((item: any, _: number): any => {
      return {
        顧客: item?.user_name ? `${item?.user_name}${item?.user_id ? `-A${item?.user_id}` : ''}` : '',
        回答日: format(new Date(item?.date), 'yyyy/MM/dd'),
        依頼内容: serviceItems[item?.service_id - 1]?.label,
        キャスト: item?.cast_name ? `${item?.cast_name}${item?.cast_id ? `-B${item?.cast_id}` : ''}` : '',
        質問_1: item?.q1 === 1 ? `満足` : item?.q1 === 2 ? `やや満足` : `不満`,
        質問_2: item?.q2 === 1 ? `満足` : item?.q2 === 2 ? `やや満足` : `不満`,
        質問_3: item?.q3 === 1 ? `はい` : item?.q3 === 2 ? `いいえ` : ``,
        質問_4: item?.q4 === 1 ? `はい` : item?.q4 === 2 ? `いいえ` : ``,
        質問_5: item?.q5 === null ? `` : item?.q5,
      };
    });
    setUserSurveyMatchingCsv(userSurveyMatchingChartClone);
  }, [userSurveyMatchingChart]);

  // GET COLUMN TABLE
  const getColumnSearchProps = (dataIndex: string): any => ({
    render: (text: any, record: any): any => {
      if (dataIndex === 'user_id') {
        if (record?.isTotal) {
          return text;
        }
        return (
          <Link to={`${config.routes.adminCustomerDetail}/${record?.user_id}`}>
            <span className="underline">
              {record?.user_name} <br />
              {record?.user_id ? `A${record?.user_id}` : ''}
            </span>
          </Link>
        );
      }
      if (dataIndex === 'date') {
        if (record?.isTotal) {
          return '';
        }
        return <span> {format(new Date(record?.date), 'yyyy/MM/dd')}</span>;
      }
      if (dataIndex === 'service_id') {
        if (record?.isTotal) {
          return '';
        }
        return <span>{serviceItems[record?.service_id - 1]?.label}</span>;
      }
      if (dataIndex === 'cast_name') {
        if (record?.isTotal) {
          return '';
        }
        return (
          <>
            {(
              <Link to={`${config.routes.detailCast}/${record?.cast_id}`}>
                <span className="underline">
                  {record?.cast_name} <br />
                  {record?.cast_id ? `B${record?.cast_id}` : ''}
                </span>
              </Link>
            ) || <span>ー</span>}
          </>
        );
      }
      if (dataIndex === 'q5') {
        if (record?.isTotal) {
          return '';
        }
        return <span>{record?.q5}</span>;
      }
    },
  });

  // HANDLE TABLE CELL
  const handleTableCell = (record: any): any => {
    if (record?.isTotal) {
      return {
        colSpan: 0,
      };
    }
    return {
      // align: 'center',
    };
  };

  // PROPS CHART
  const PropsDataChartQ1GQ3: any = {
    data1: listSurveyMatchingChooseQ1_1
      ? listSurveyMatchingChooseQ1_1?.filter((item: any): boolean => item?.q3 === 1)?.length
      : 0,
    data3: listSurveyMatchingChooseQ1_1
      ? listSurveyMatchingChooseQ1_1?.filter((item: any): boolean => item?.q3 === 2)?.length
      : 0,
    title1: 'Q1の「満足」と答えた方',
    title2: `Q3の回答割合`,
  };

  const PropsDataChartQ1GQ4: any = {
    data1: listSurveyMatchingChooseQ1_1
      ? listSurveyMatchingChooseQ1_1?.filter((item: any): boolean => item?.q4 === 1)?.length
      : 0,
    data3: listSurveyMatchingChooseQ1_1
      ? listSurveyMatchingChooseQ1_1?.filter((item: any): boolean => item?.q4 === 2)?.length
      : 0,
    title1: 'Q1の「満足」と答えた方',
    title2: `Q4の回答割合`,
  };

  const PropsDataChartQ1SGQ3: any = {
    data1: listSurveyMatchingChooseQ1_2
      ? listSurveyMatchingChooseQ1_2?.filter((item: any): boolean => item?.q3 === 1)?.length
      : 0,

    data3: listSurveyMatchingChooseQ1_2
      ? listSurveyMatchingChooseQ1_2?.filter((item: any): boolean => item?.q3 === 2)?.length
      : 0,

    title1: 'Q1の「やや満足」と答えた方',
    title2: `Q3の回答割合`,
  };

  const PropsDataChartQ1SGQ4: any = {
    data1: listSurveyMatchingChooseQ1_2
      ? listSurveyMatchingChooseQ1_2?.filter((item: any): boolean => item?.q4 === 1)?.length
      : 0,
    data3: listSurveyMatchingChooseQ1_2
      ? listSurveyMatchingChooseQ1_2?.filter((item: any): boolean => item?.q4 === 2)?.length
      : 0,
    title1: 'Q1の「やや満足」と答えた方',
    title2: `Q4の回答割合`,
  };

  // COLUMNS TABLES
  const columns: any = [
    {
      key: 'created_at',
      title: '顧客',
      dataIndex: 'user_id',
      width: 122,
      ...getColumnSearchProps('user_id'),
      onCell: (record: any): any => {
        if (record?.isTotal) {
          return { colSpan: 4, className: 'total', align: 'center' };
        }
        return {
          // align: 'center',
        };
      },
    },
    {
      key: 'id',
      title: '回答日',
      dataIndex: 'date',
      width: 122,
      onCell: handleTableCell,
      ...getColumnSearchProps('date'),
    },
    {
      key: 'name',
      title: '依頼内容',
      dataIndex: 'service_id',
      width: 123,
      onCell: handleTableCell,
      ...getColumnSearchProps('service_id'),
    },
    {
      key: 'address',
      title: 'キャスト',
      dataIndex: 'cast_name',
      width: 123,
      onCell: handleTableCell,
      ...getColumnSearchProps('cast_name'),
    },
    {
      key: 'stage',
      align: 'left',
      title: (
        <div className="th-question">
          <span>Q1</span>
          <br />
          サービスの品質は いかがでしたか?
        </div>
      ),
      children: [
        {
          key: 'stage',
          width: 65,
          align: 'center',
          className: 'survey-satisfied',
          title: '満足',
          render: (text: any, record: any) => {
            if (record?.q1 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q1?.q1_1;
            }
            if (record?.q1 === 1) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
        {
          key: 'stage',
          width: 65,
          align: 'center',
          className: 'survey-sub-satisfied',
          title: 'やや 満足',
          render: (text: any, record: any) => {
            if (record?.q1 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q1?.q1_2;
            }
            if (record?.q1 === 2) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <div className="survey-vertical">-</div>;
          },
        },
        {
          key: 'stage',
          width: 65,
          align: 'center',
          className: 'survey-complaint',
          title: '不満',
          render: (text: any, record: any) => {
            if (record?.q1 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q1?.q1_3;
            }
            if (record?.q1 === 3) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
      ],
    },

    {
      key: 'details',
      align: 'left',
      title: (
        <div className="th-question second">
          <span>Q2</span>
          <br />
          キャストの態度や言動 はいかがでしたか?
        </div>
      ),
      dataIndex: 'id',
      width: 197,

      children: [
        {
          key: 'stage',
          width: 65,
          title: '満足',
          align: 'center',
          className: 'survey-satisfied',
          render: (text: any, record: any) => {
            if (record?.q2 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q2?.q2_1;
            }
            if (record?.q2 === 1) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
        {
          key: 'stage',
          width: 65,
          title: 'やや 満足',
          align: 'center',
          className: 'survey-sub-satisfied',
          render: (text: any, record: any) => {
            if (record?.q2 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q2?.q2_2;
            }
            if (record?.q2 === 2) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
        {
          key: 'stage',
          width: 65,
          title: '不満',
          align: 'center',
          className: 'survey-complaint',
          render: (text: any, record: any) => {
            if (record?.q2 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q2?.q2_3;
            }
            if (record?.q2 === 3) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
      ],
    },
    {
      key: 'details',
      align: 'left',
      title: (
        <div className="th-question second">
          <span>Q3</span>
          <br />
          サービスをまた利用 したいと思いますか?
        </div>
      ),
      dataIndex: 'id',
      width: 50,
      children: [
        {
          key: 'stage',
          width: 99,
          align: 'center',
          className: 'survey-satisfied',
          title: 'はい',
          render: (text: any, record: any) => {
            if (record?.q3 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q3?.q3_1;
            }
            if (record?.q3 === 1) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
        {
          key: 'stage',
          width: 99,
          align: 'center',
          className: 'survey-complaint',
          title: 'いいえ',
          render: (text: any, record: any) => {
            if (record?.q3 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q3?.q3_2;
            }
            if (record?.q3 === 2) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
      ],
    },
    {
      key: 'details',
      align: 'left',
      title: (
        <div className="th-question second">
          <span>Q4</span>
          <br />
          定期的に利用したい と思いますか?'
        </div>
      ),
      dataIndex: 'id',
      width: 80,
      children: [
        {
          key: 'stage',
          width: 99,
          title: 'はい',
          align: 'center',
          className: 'survey-satisfied',
          render: (_: any, record: any) => {
            if (record?.q4 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q4?.q4_1;
            }
            if (record?.q4 === 1) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
        {
          key: 'stage',
          width: 99,
          title: 'いいえ',
          align: 'center',
          className: 'survey-complaint',
          render: (text: any, record: any) => {
            if (record?.q4 === undefined && !record?.isTotal) {
              return '';
            }
            if (record?.isTotal) {
              return record?.totalData?.q4?.q4_2;
            }
            if (record?.q4 === 2) {
              return (
                <div className="survey-actions">
                  <div className="survey-dot"></div>
                </div>
              );
            } else return <>-</>;
          },
        },
      ],
    },
    {
      key: 'details',
      title: (
        <div className="th-question fifth">
          <span>Q5</span>
          <br />
          その他の自由回答
        </div>
      ),
      dataIndex: 'id',
      children: [
        {
          key: 'stage',
          className: 'survey-q5',
          width: 197,
          title: '',
          dataIndex: 'q5',
          ...getColumnSearchProps('q5'),
        },
      ],
    },
  ];

  // HANDLE CHANGE MONTH
  const handleChangeMonth = (monthItem: any): void => {
    setSearchParams({ month: monthItem?.month?.toString(), year: monthItem.year.toString() });
  };

  return (
    <div className="survey-sheetlist-wrapper">
      <div className="csv-block">
        <div className="survey-sheetlist-actions">
          <Select
            defaultValue={defaultValueSelectMonth}
            key={defaultValueSelectMonth}
            style={{ width: 140 }}
            options={generateOptionsMonth()}
            onChange={(_: string, option: any) => handleChangeMonth(option)}
          />
          <CSVLink
            target="_blank"
            data={userSurveyMatchingCsv ? userSurveyMatchingCsv : []}
            filename={`user_survey_matching_list.csv`}
          >
            <button> CSV出力</button>
          </CSVLink>
        </div>
        <div className="survey-title">
          <span>{searchParams.get('month')}月のアンケート一覧</span>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={userSurveyMatching}
        bordered={true}
        pagination={false}
        loading={loading}
        rowClassName={(record): string => (record?.key % 2 !== 0 ? '' : 'row-color')}
        rowKey={(record: any) => {
          return record?.survey_id;
        }}
      />

      <div className="chart-container">
        <div className="row">
          <ChartComponent
            data1={listSurveyMatchingChooseQ1_1 ? listSurveyMatchingChooseQ1_1?.length : 0}
            data2={listSurveyMatchingChooseQ1_2 ? listSurveyMatchingChooseQ1_2?.length : 0}
            data3={listSurveyMatchingChooseQ1_3 ? listSurveyMatchingChooseQ1_3?.length : 0}
            title1={'Q1'}
            title2={`全体で満足、やや満足、不満の円グラフ`}
          />
          <ChartComponent
            data1={
              listSurveyMatchingChooseQ1_1
                ? listSurveyMatchingChooseQ1_1?.filter((item: any) => item?.q2 === 1)?.length
                : 0
            }
            data2={
              listSurveyMatchingChooseQ1_1
                ? listSurveyMatchingChooseQ1_1?.filter((item: any) => item?.q2 === 2)?.length
                : 0
            }
            data3={
              listSurveyMatchingChooseQ1_1
                ? listSurveyMatchingChooseQ1_1?.filter((item: any) => item?.q2 === 3)?.length
                : 0
            }
            title1={'Q1の「満足」と答えた方'}
            title2={`Q2の回答割合`}
          />
          <ChartComponent
            data1={
              listSurveyMatchingChooseQ1_2
                ? listSurveyMatchingChooseQ1_2?.filter((item: any) => item?.q2 === 1)?.length
                : 0
            }
            data2={
              listSurveyMatchingChooseQ1_2
                ? listSurveyMatchingChooseQ1_2?.filter((item: any) => item?.q2 === 2)?.length
                : 0
            }
            data3={
              listSurveyMatchingChooseQ1_2
                ? listSurveyMatchingChooseQ1_2?.filter((item: any) => item?.q2 === 3)?.length
                : 0
            }
            title1={'Q1の「やや満足」と答えた方'}
            title2={`Q2の回答割合`}
          />
          <ChartComponent
            data1={
              listSurveyMatchingChooseQ1_3
                ? listSurveyMatchingChooseQ1_3?.filter((item: any) => item?.q2 === 1)?.length
                : 0
            }
            data2={
              listSurveyMatchingChooseQ1_3
                ? listSurveyMatchingChooseQ1_3?.filter((item: any) => item?.q2 === 2)?.length
                : 0
            }
            data3={
              listSurveyMatchingChooseQ1_3
                ? listSurveyMatchingChooseQ1_3?.filter((item: any) => item?.q2 === 3)?.length
                : 0
            }
            title1={'Q1の「不満」と答えた方'}
            title2={`Q2の回答割合`}
          />
        </div>
        <div className="row">
          <ChartComponent {...PropsDataChartQ1GQ3} />
          <ChartComponent {...PropsDataChartQ1GQ4} />
          <ChartComponent {...PropsDataChartQ1SGQ3} />
          <ChartComponent {...PropsDataChartQ1SGQ4} />
        </div>
      </div>
    </div>
  );
};

export default SurveySheetList;
