import { CSVLink } from 'react-csv';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Modal, Pagination, Space, Table } from 'antd';

import { deleteBookingMatching, getListMatching } from '../../../redux/services/adminSlice';
import { hourScheduleItems } from '../../../utils/hourScheduleItems';
import { serviceItems } from '../../../utils/customerServiceItems';
import useNotification from 'antd/es/notification/useNotification';
import { alertFail, alertSuccess } from '../../../helper/common';
import config from '../../../config';

const DEFAULT_PAGE = '1';
const DEFAULT_SIZE = '10';

const BookingList = (): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = useNotification();

  // HOOKS STATE
  const [idMatching, setIdMatching]: [any, React.Dispatch<any>] = useState();
  const [isModalOpen, setIsModalOpen]: [boolean, React.Dispatch<any>] = useState(false);

  // PARAMSS
  let [searchParams, setSearchParams]: any = useSearchParams({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_SIZE,
  });

  // REDUCERS
  const { listMatching, loading }: any = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect(() => {
    if (searchParams.get('page') === null) {
      setSearchParams({ page: DEFAULT_PAGE });
    }
  }, [searchParams, setSearchParams]);

  // GET MATCHING WITH PARAMS
  useEffect((): void => {
    dispatch(getListMatching(searchParams));
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

  // FORMAT LIST MATCHING
  const formattedListMatching: any =
    listMatching?.length !== 0 && listMatching !== undefined
      ? listMatching?.data?.map((matching: any, index: any) => ({
          ...matching,
          service_id: serviceItems[matching?.service_id - 1]?.label,
          hour: hourScheduleItems[matching?.hour - 2]?.title,
          status_matching: matching?.status_matching === 0 ? 'アサイン中' : '確定',
          key: index + 1,
        }))
      : [];

  // SHOW MODAL
  const showModal = (id: any): void => {
    setIsModalOpen(true);
    setIdMatching(id);
  };

  // HANDLE DELETE MATCHING
  const handleDeleteMatching = async (): Promise<any> => {
    try {
      const res: any = await dispatch(deleteBookingMatching(idMatching));
      if (res?.payload?.status === 'success') {
        dispatch(getListMatching(searchParams));
        alertSuccess(api, '変更が完了しました。');
        setIsModalOpen(false);
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    } catch (error) {}
  };

  // CLOSE MODAL
  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  // COLUMN TABLES
  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: '依頼内容',
      dataIndex: 'service_id',
      width: '7%',
      render: (text, _) => <span>{text}</span>,
    },
    {
      key: 2,
      title: '依頼日',
      dataIndex: 'date',
      width: '7%',
      render: (text, _) => <span>{convertDate(text)}</span>,
    },
    {
      key: 3,
      title: '依頼時間',
      dataIndex: 'hour',
      width: '7%',
      render: (text, _) => <span>{text}</span>,
    },
    {
      key: 4,
      title: '依頼者',
      dataIndex: 'user_name',
      width: '7%',
      render: (_, record) => (
        <>
          {
            <>
              <Link to={`${config.routes.adminCustomerDetail}/${record?.user_id}`}>
                {record?.user_name === null ? (
                  <span>ー</span>
                ) : (
                  <span className="underline">
                    {record?.user_name} <br />
                    {!record?.user_id ? '' : `A${record?.user_id}`}
                  </span>
                )}
              </Link>
            </>
          }
        </>
      ),
    },
    {
      key: 5,
      title: '住所',
      dataIndex: 'address',
      width: '7%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 6,
      title: 'キャスト',
      dataIndex: 'cast_name_not_assign',
      width: '7%',
      render: (text, record) => {
        return record?.cast_id_not_assign !== null ? (
          <>
            {
              <Link to={`${config.routes.detailCast}/${record?.cast_id_not_assign}`}>
                {record?.cast_name === null ? (
                  ''
                ) : (
                  <span className="underline">
                    {text} <br />
                    {!record?.cast_id_not_assign ? '' : `B${record?.cast_id_not_assign}`}
                  </span>
                )}
              </Link>
            }
          </>
        ) : (
          <span>ー</span>
        );
      },
    },
    {
      key: 11,
      title: '指名キャスト',
      dataIndex: 'cast_name_assign',
      width: '7%',
      render: (text, record) => {
        return record?.cast_id_assign ? (
          <>
            {
              <Link to={`${config.routes.detailCast}/${record?.cast_id_assign}`}>
                {record?.cast_name === null ? (
                  ''
                ) : (
                  <span className="underline">
                    {text} <br />
                    {record?.cast_id_assign ? `B${record?.cast_id_assign}` : ''}
                  </span>
                )}
              </Link>
            }
          </>
        ) : (
          <span>ー</span>
        );
      },
    },

    {
      key: 7,
      title: 'キャンセル',
      dataIndex: 'cancel',
      width: '7%',
      render: (text, _) => <span>{text !== null ? text : 'ー'}</span>,
    },
    {
      key: 8,
      title: 'クーポン利用',
      dataIndex: 'coupon',
      width: '7%',
      render: (text, _) => <span>{text ? 'あり' : 'ー'}</span>,
    },
    {
      key: 9,
      title: '暫定料金',
      dataIndex: 'estimate_price',
      width: '7%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 10,
      title: 'ステータス',
      dataIndex: 'status_matching',
      width: '7%',
      render: (text, _) => <span>{text}</span>,
    },
    {
      key: 23,
      title: '備考',
      dataIndex: 'request_description',
      width: '7%',
      render: (text, _) => <span>{text ?? 'ー'}</span>,
    },
    {
      key: 22,
      title: '',
      dataIndex: 'id',
      width: '2%',
      render: (_, record) => (
        <>
          <div className="item-icon-delete" onClick={() => showModal(record?.id)}>
            {record?.status_delete === 1 ? <DeleteOutlined /> : ''}
          </div>
        </>
      ),
    },
  ];

  // HANDLE DATA CSV
  const dataBookingListCsv = formattedListMatching?.map((item: any): any => ({
    依頼内容: item?.service_id,
    依頼日: convertDate(item?.date),
    依頼時間: item?.hour,
    依頼者: item?.user_name ? `${item?.user_name}${item?.user_id ? `-A${item?.user_id}` : ''}` : '',
    住所: item?.address,
    キャスト: item?.cast_name_not_assign
      ? `${item?.cast_name_not_assign}${item?.cast_id_not_assign ? `-B${item?.cast_id_not_assign}` : ''}`
      : '',
    指名キャスト: item?.cast_name_assign
      ? `${item?.cast_name_assign}${item?.cast_id_assign ? `-B${item?.cast_id_assign}` : ''}`
      : '',
    キャンセル: item?.cancel || '',
    クーポン利用: item?.coupon || '',
    暫定料金: item?.estimate_price || '',
    ステータス: item?.status_matching || '',
    備考: item?.request_description || '',
  }));

  const bookingListFooter = () => {
    return (
      <div className="btn-modal-delete-matching">
        <Button key="back" onClick={handleCancel} className="btn-back">
          一覧に戻る
        </Button>
        <Button
          key="submit"
          type="primary"
          loading={loading}
          className="btn-delete-matching"
          onClick={handleDeleteMatching}
        >
          キャンセルする
        </Button>
      </div>
    );
  };

  return (
    <>
      {showPopup}
      <Modal
        title={''}
        open={isModalOpen}
        className="modal-delete-matching"
        closable={false}
        footer={[bookingListFooter()]}
        onCancel={handleCancel}
        closeIcon={<></>}
      >
        <h3 className="title-delete-matching">このマッチング1件をキャンセル(無効)しますか? </h3>
        <span className="delete-content">一度キャンセルを押すと元に戻せません。</span>
      </Modal>
      <div className="csv-block">
        <CSVLink target="_blank" data={dataBookingListCsv} filename={`matching-list-export.csv`}>
          <button> CSV出力</button>
        </CSVLink>
      </div>
      <Table
        rowKey="key"
        bordered={true}
        columns={columns}
        loading={loading}
        pagination={false}
        dataSource={formattedListMatching}
        rowClassName={(record, _): string => (record.key % 2 !== 0 ? '' : 'row-color')}
      />
      <Space style={{ width: '100%', marginTop: '2rem' }} direction="vertical" align="end">
        <Pagination
          onChange={handlePagination}
          current={Number(searchParams.get('page'))}
          showSizeChanger={false}
          pageSize={listMatching?.per_page || 10}
          total={listMatching?.total}
        />
      </Space>
    </>
  );
};

export default BookingList;
