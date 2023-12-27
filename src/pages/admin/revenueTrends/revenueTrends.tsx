import { CSVLink } from 'react-csv';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Select, Space, Table } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { Dispatch, useEffect, useState } from 'react';

import { hourScheduleItems } from '../../../utils/hourScheduleItems';
import { getSalesTrend } from '../../../redux/services/adminSlice';
import { serviceItems } from '../../../utils/customerServiceItems';
import { formatCash, generateOptionsMonth } from '../../../helper/common';
import config from '../../../config';

// GET DATE NOW
const dateNow: Date = new Date();

// GET DEFAULT VALUE SELECT MONTH
const defaultSelectMonthState: string = `${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`;

const RevenueTrends = () => {
  const dispatch: Dispatch<any> = useDispatch();
  let [searchParams, setSearchParams]: any = useSearchParams();

  // HOOK STATE
  const [defaultValueSelectMonth, setDefaultValueSelectMonth]: any = useState<any>('');

  // HOOK REDUCER
  const { listMatchingForTrends, loading, salesTrend } = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect((): void => {
    dispatch(getSalesTrend(searchParams));
  }, [dispatch, searchParams]);

  useEffect((): void => {
    if (!searchParams.get('page') && !searchParams.get('month') && !searchParams.get('year')) {
      setSearchParams({
        page: '1',
        month: (dateNow.getMonth() + 1).toString(),
        year: dateNow.getFullYear().toString(),
      });
      setDefaultValueSelectMonth(defaultSelectMonthState);
    } else {
      setDefaultValueSelectMonth(`${searchParams.get('month')}-${searchParams.get('year')}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // COMLUMNS TABLE
  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: '依頼内容',
      dataIndex: 'service_id',
      width: '11%',
      render: (text, _) => <span> {text}</span>,
    },
    {
      key: 2,
      title: '依頼日',
      dataIndex: 'date',
      width: '9%',
      render: (text, _) => <span> {convertDate(text)}</span>,
    },
    {
      key: 3,
      title: '依頼時間',
      dataIndex: 'hour',
      width: '9%',
      render: (text, _) => <span>{text}</span>,
    },
    {
      key: 4,
      title: '依頼者',
      dataIndex: 'user_name',
      width: '9%',
      render: (_, record) =>
        record?.user_id ? (
          <>
            {
              <>
                <Link to={`${config.routes.adminCustomerDetail}/${record?.user_id}`}>
                  <span className="underline">
                    {record?.user_name} <br />
                    {record?.user_id ? `A${record?.user_id}` : ''}
                  </span>
                </Link>
              </>
            }
          </>
        ) : (
          <span>ー</span>
        ),
    },
    {
      key: 5,
      title: '住所',
      dataIndex: 'address',
      width: '9%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 6,
      title: 'キャスト',
      dataIndex: 'cast_name_assign',
      width: '9%',
      render: (_, record) =>
        record?.cast_name_assign || record?.cast_id_assign ? (
          <>
            {
              <Link to={`${config.routes.detailCast}/${record?.cast_id_assign}`}>
                <span className="underline">
                  {record?.cast_name_assign} <br /> {record?.cast_id_assign ? `B${record?.cast_id_assign}` : ''}
                </span>
              </Link>
            }
          </>
        ) : (
          <span>ー</span>
        ),
    },
    {
      key: 11,
      title: '指名キャスト',
      dataIndex: 'cast_name',
      width: '9%',
      render: (_, record) =>
        record?.cast_name || record?.cast_id ? (
          <>
            {
              <Link to={`${config.routes.detailCast}/${record?.cast_id}`}>
                <span className="underline">
                  {record?.cast_name} <br />
                  {record?.cast_id ? `B${record?.cast_id}` : ''}
                </span>
              </Link>
            }
          </>
        ) : (
          <span>ー</span>
        ),
    },
    {
      key: 7,
      title: '延長',
      dataIndex: 'extend',
      width: '9%',
      render: (text, _) => <span>{text === 0 ? 'ー' : 'あり'}</span>,
    },
    {
      key: 8,
      title: 'クーポン利用',
      dataIndex: 'coupon_code',
      width: '9%',
      render: (text, _) => <span>{text !== 0 ? 'あり' : 'ー'}</span>,
    },
    {
      key: 9,
      title: '金額',
      dataIndex: 'price',
      width: '9%',
      render: (text, _) => <span>{formatCash(text.toString()) || 'ー'}</span>,
    },
  ];

  // HANDLE CHANGE PAGINATION
  const handlePagination = (page: number): void => {
    const updatedParams: any = {
      page: page.toString(),
      month: searchParams.get('month'),
      year: searchParams.get('year'),
    };
    setSearchParams(updatedParams);
  };

  // HANDLE CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  // HANDLE FORMAT LIST MATCHING
  const formattedListMatching =
    listMatchingForTrends?.length !== 0 && listMatchingForTrends !== undefined
      ? listMatchingForTrends?.map((matching: any, index: any) => ({
          ...matching,
          service_id: serviceItems[matching?.service_id - 1]?.label,
          hour: hourScheduleItems[matching?.hour - 2]?.title,
          status_matching: matching?.status_matching === 0 ? 'アサイン中' : '確定',
          key: index + 1,
        }))
      : [];

  const dataBookingListCsv = formattedListMatching?.map((item: any): any => ({
    依頼内容: item?.service_id,
    依頼日: convertDate(item?.date),
    依頼時間: item?.hour,
    依頼者: item?.user_name ? `${item?.user_name}${item?.user_id ? `-A${item?.user_id}` : ''}` : '',
    住所: item?.address,
    キャスト: item?.cast_name_assign
      ? `${item?.cast_name_assign}${item?.cast_id_assign ? `-B${item?.cast_id_assign}` : ''}`
      : '',
    指名キャスト: item?.cast_name ? `${item?.cast_name}${item?.cast_id ? `-B${item?.cast_id}` : ''}` : '',
    延長: item?.extend === 0 ? '' : 'あり',
    クーポン利用: item?.coupon_code === 0 ? '' : 'あり',
    金額: item?.price ? formatCash(item?.price.toString()) : '',
  }));

  // HANDLE CHANGE MONTH
  const handleChangeMonth = (monthItem: any): void => {
    setSearchParams({
      page: searchParams.get('page'),
      month: monthItem?.month?.toString(),
      year: monthItem.year.toString(),
    });
  };

  return (
    <>
      <div className="csv-block">
        <div className="csv-group">
          <Select
            defaultValue={defaultValueSelectMonth}
            key={defaultValueSelectMonth}
            style={{ width: 140 }}
            options={generateOptionsMonth()}
            onChange={(_: string, option: any) => handleChangeMonth(option)}
          />
          <CSVLink
            target="_blank"
            data={dataBookingListCsv ? dataBookingListCsv : []}
            filename={`matching-list-export.csv`}
          >
            <button> CSV出力</button>
          </CSVLink>
        </div>
      </div>
      <span className="revenue-trend-title">{searchParams.get('month')}月の売上動向</span>
      <Table
        columns={columns}
        dataSource={formattedListMatching}
        bordered={true}
        pagination={false}
        rowKey="key"
        loading={loading}
        rowClassName={(record, _) => (record.key % 2 !== 0 ? '' : 'row-color')}
      />
      <div className="revenue-total-price">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span>合計金額</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={salesTrend?.total_money ? `${formatCash(salesTrend?.total_money?.toString())}円` : ''}
            readOnly
          />
        </div>
      </div>
      <Space style={{ width: '100%', marginTop: '2rem' }} direction="vertical" align="end">
        <Pagination
          onChange={handlePagination}
          current={Number(searchParams.get('page'))}
          showSizeChanger={false}
          pageSize={salesTrend?.per_page || 10}
          total={salesTrend?.total}
        />
      </Space>
    </>
  );
};

export default RevenueTrends;
