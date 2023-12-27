import { CSVLink } from 'react-csv';
import { Pagination, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import React, { Dispatch, useEffect, useState } from 'react';

import { getListCast } from '../../../redux/services/adminSlice';
import { rankCastItems } from '../../../utils/rankCastItems';
import config from '../../../config';

const DEFAULT_PAGE: string = '1';
const DEFAULT_SIZE: string = '10';

const CastList = (): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();

  // PARAMS
  const [searchParams, setSearchParams]: any = useSearchParams({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_SIZE,
  });

  // HOOK STATE
  const [listCastData, setListCastData]: [any, React.Dispatch<any>] = useState<any>([]);
  const [listCastDataCsv, setListCastDataCsv]: [any, React.Dispatch<any>] = useState<any>([]);

  // REDUCER
  const { listCast, loading } = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect(() => {
    if (!searchParams.get('page') || searchParams.get('page') === '0') {
      setSearchParams({
        page: DEFAULT_PAGE,
      });
    } else {
      dispatch(getListCast(Number(searchParams.get('page'))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchParams]);

  useEffect(() => {
    let listCastDataClone = listCast?.data;
    let newListCastDataClone = listCastDataClone?.map((item: any, index: number) => {
      return {
        key: (Number(searchParams.get('page')) - 1) * 10 + index + 1,
        ...item,
        rank: `${rankCastItems[item?.rank - 1]?.label ?? '#1'}`,
      };
    });
    let newListCastDataCsv = listCastDataClone?.map((item: any, index: number) => {
      return {
        '': (Number(searchParams.get('page')) - 1) * 10 + index + 1,
        登録日: convertDate(item?.created_at),
        キャストID: `B${item?.id}`,
        氏名: item?.name,
        住所: item?.address,
        キャストランク: item?.rank !== null ? `#${item?.rank}` : '#1',
      };
    });
    setListCastData(newListCastDataClone);
    setListCastDataCsv(newListCastDataCsv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCast]);

  // COLUMNS TABLE
  const columns: ColumnsType<any> = [
    {
      title: ' ',
      dataIndex: 'key',
      width: 32,
      render: (text: string, _: any, __: number) => <span className="detail-table">{text}</span>,
    },
    {
      title: '登録日',
      dataIndex: 'created_at',
      width: 180,
      render: (text: string) => <span>{convertDate(text)}</span>,
    },
    {
      title: 'キャストID',
      dataIndex: 'id',
      width: 180,
      render: (text: string) => <span>{`B${text}`}</span>,
    },
    {
      title: '氏名',
      dataIndex: 'name',
      width: 180,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: '住所',
      dataIndex: 'address',
      width: 180,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'キャストランク',
      dataIndex: 'rank',
      width: 180,
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '',
      dataIndex: 'id',
      width: 70,
      render: (text: string) => (
        <span className="detail-table underline">
          <Link to={`${config.routes.detailCast}/${text}`}>詳細</Link>
        </span>
      ),
    },
  ];

  // HANDLE PAGINATION
  const handlePagination = async (page: number) => {
    setSearchParams({ page: page + '' });
  };

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  return (
    <div className="cast-list-wrapper">
      <div className="csv-block">
        <CSVLink target="_blank" data={listCastDataCsv ? listCastDataCsv : []} filename={`cast-list-export.csv`}>
          <button className="btn-csv" type="button">
            CSV出力
          </button>
        </CSVLink>
      </div>
      <Table
        bordered={true}
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={listCastData}
        rowClassName={(record, _) => (record.key % 2 !== 0 ? '' : 'row-color')}
      />

      <Space style={{ width: '100%', marginTop: '2rem' }} direction="vertical" align="end">
        <Pagination
          onChange={handlePagination}
          pageSize={listCast?.per_page || 10}
          total={listCast?.total}
          current={Number(searchParams.get('page'))}
        />
      </Space>
    </div>
  );
};

export default CastList;
