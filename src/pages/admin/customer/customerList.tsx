import { CSVLink } from 'react-csv';
import { Dispatch, useEffect } from 'react';
import { Pagination, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { getListUser } from '../../../redux/services/adminSlice';
import { RankUserItems } from '../../../utils/rankUserItems';
import config from '../../../config';

const CustomerList = () => {
  const dispatch: Dispatch<any> = useDispatch();
  let [searchParams, setSearchParams]: any = useSearchParams({
    page: '1',
    page_size: '10',
  });

  // REDUCERS
  const { listUser, loading } = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect((): void => {
    if (searchParams.get('page') === null) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('page') !== null) {
      dispatch(getListUser(searchParams));
    }
  }, [dispatch, searchParams]);

  // HANDLE PAGINATION
  const handlePagination = (page: number) => {
    const updatedParams: any = { page: page.toString() };
    setSearchParams(updatedParams);
  };

  // HANDLE CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  // COLUMN TABLE
  const columns: ColumnsType<any> = [
    {
      key: 'input',
      title: ' ',
      dataIndex: 'key',
      width: 32,
      render: (text, _) => <span className="detail-table">{text}</span>,
    },
    {
      key: 'created_at',
      title: '登録日',
      dataIndex: 'created_at',
      width: 180,
      render: (text, _) => <span>{convertDate(text) || 'ー'}</span>,
    },
    {
      key: 'id',
      title: '顧客ID',
      dataIndex: 'id',
      width: 180,
      render: (text, _) => <span>{`A${text}`}</span>,
    },
    {
      key: 'name',
      title: '氏名',
      dataIndex: 'name',
      width: 180,
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 'address',
      title: '住所',
      dataIndex: 'address',
      width: 180,
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 'stage',
      title: ' 顧客ステージ',
      dataIndex: 'rank',
      width: 180,
      render: (text, _) => <span>{text || 'ー'} </span>,
    },

    {
      key: 'details',
      title: ' ',
      dataIndex: 'id',
      width: 70,
      render: (text, _) => (
        <span className="detail-table underline">
          {<Link to={`${config.routes.adminCustomerDetail}/${text}`}>詳細</Link>}
        </span>
      ),
    },
  ];

  // HANLDE FORMAT LIST USER
  const formattedListUser =
    listUser?.length !== 0 && listUser !== undefined
      ? listUser?.data?.map((user: any, index: any) => ({
          key: (Number(searchParams.get('page')) - 1) * 10 + index + 1,
          ...user,
          rank: RankUserItems[user?.rank - 1]?.label || 'ー',
        }))
      : [];

  // HANDLE DATA CSV
  const dataListUserCsv =
    listUser?.length !== 0 && listUser !== undefined
      ? listUser?.data?.map((user: any, index: number): any => ({
          '': index + 1,
          登録日: convertDate(user?.created_at),
          顧客ID: `A${user?.id}`,
          氏名: user?.name,
          住所: user?.address,
          顧客ステージ: RankUserItems[user?.rank - 1]?.label || 'ー',
        }))
      : [];

  return (
    <div className="admin-customer-list">
      <div className="csv-block">
        <CSVLink target="_blank" data={dataListUserCsv} filename={`customer-list-export.csv`}>
          <button> CSV出力</button>
        </CSVLink>
      </div>
      <Table
        columns={columns}
        dataSource={formattedListUser}
        bordered={true}
        pagination={false}
        loading={loading}
        rowClassName={(record, _: number): any => (record?.key % 2 !== 0 ? '' : 'row-color')}
        rowKey={'key'}
      />
      <Space style={{ width: '100%', marginTop: '2rem' }} direction="vertical" align="end">
        <Pagination
          onChange={handlePagination}
          current={Number(searchParams.get('page'))}
          pageSize={listUser?.per_page || 10}
          total={listUser?.total}
        />
      </Space>
    </div>
  );
};
export default CustomerList;
