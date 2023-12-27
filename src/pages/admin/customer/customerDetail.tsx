import { CSVLink } from 'react-csv';
import type { MenuProps } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { Dispatch, useEffect, useRef, useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Modal, Space, Table } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { alertFail, alertSuccess, formatCash } from '../../../helper/common';

import { transportationItems } from '../../../utils/transportationItems';
import { hourScheduleItems } from '../../../utils/hourScheduleItems';
import { serviceItems } from '../../../utils/customerServiceItems';
import { CapacityKItems } from '../../../utils/capacityKItems';
import { CapacityMItems } from '../../../utils/capacityMItems';
import { RankUserItems } from '../../../utils/rankUserItems';
import { BuildingType } from '../../../utils/buildingType';
import { listGender } from '../../../utils/genderItems';
import { CardItems } from '../../../utils/cardItems';
import { JobItems } from '../../../utils/jobItems';
import config from '../../../config';
import {
  deleteUserMatching,
  getCalendarUser,
  getUserDetail,
  putHearingStatus,
  putMemoHearing,
  putRankUser,
} from '../../../redux/services/adminSlice';
import { buildingHeightItems } from '../../../utils/buildingHeightItems';

const items: any = [
  {
    key: '0',
    label: '完了',
  },
  {
    key: '1',
    label: '未完了',
  },
];
const NOT_EKYC = '未処理';
const EKYC_NG = 'NG';
const EKYC_PENDING = '処理中';
const EKYC_OK = '完了';

export default function CustomerDetail(): JSX.Element {
  const { id }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = useNotification();

  // REDUCER
  const { listUserDetail, listCalendarUser } = useSelector((state: any) => state.adminReducer);

  // HOOK STATE
  const [idMatching, setIdMatching]: [any, React.Dispatch<any>] = useState();
  const [dataSource, setDataSource]: [any, React.Dispatch<any>] = useState<any>([]);
  const [isEditing, setIsEditing]: [boolean, React.Dispatch<boolean>] = useState(false);
  const [dataExportCSV, setDataExportCSV]: [any, React.Dispatch<any>] = useState<any>([]);
  const [isModalOpen, setIsModalOpen]: [boolean, React.Dispatch<boolean>] = useState(false);
  const [memoHearing, setMemoHearing]: [any, React.Dispatch<any>] = useState(listUserDetail?.memo_hearing || '');

  // HOOK REF
  const refMemo: any = useRef<any>(null);

  // HANDLE DATE
  const date: Date = new Date();
  const month: number = date.getMonth() + 1;

  // FORMAT LIST USER
  const formattedListUser =
    dataSource?.length !== 0 && dataSource !== undefined
      ? dataSource?.map((user: any, index: any) => ({ ...user, key: index }))
      : dataSource;

  // FORMAT LIST CALENDAR
  const formattedListCalendar =
    listCalendarUser?.length !== 0 && listCalendarUser !== undefined
      ? listCalendarUser?.map((item: any, index: any) => ({ ...item, key: `calendar-${index}` }))
      : listCalendarUser;

  // HOOK EFFECT
  useEffect((): void => {
    dispatch(getUserDetail(id));
    dispatch(getCalendarUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    setMemoHearing(listUserDetail?.memo_hearing || '');
  }, [listUserDetail?.memo_hearing]);

  useEffect(() => {
    if (listUserDetail) {
      setDataSource([
        {
          id: id,
          ...listUserDetail,
          gender: listGender[listUserDetail?.gender - 1],
          transportation: transportationItems[listUserDetail?.transportation - 1]?.title,
          building_type: BuildingType[listUserDetail?.building_type - 1]?.title,
          capacity_k: CapacityKItems[listUserDetail?.capacity_k - 1]?.title,
          profession: JobItems[listUserDetail?.profession - 1]?.title,
          capacity_m: CapacityMItems[listUserDetail?.capacity_m - 1]?.title,
          card_type: CardItems[listUserDetail?.card_type - 1]?.title,
          dob: convertDate(listUserDetail?.dob),
          rank: RankUserItems[listUserDetail?.rank - 1]?.label,
          status_hearing: items[listUserDetail?.status_hearing === 1 ? 1 : 0]?.label,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUserDetail]);

  useEffect((): void => {
    const tmpDataCalendar = formattedListCalendar?.map((calendar: any) => {
      return _.values({
        service: serviceItems[calendar?.service_id]?.label ?? '',
        date: calendar?.date ?? '',
        hour: hourScheduleItems[calendar?.hour - 2]?.title ?? '',
        cast_name_not_assign: !calendar?.cast_name_not_assign
          ? ''
          : `${calendar?.cast_name_not_assign}${
              calendar?.cast_id_not_assign ? `-B${calendar?.cast_id_not_assign}` : ''
            }`,
        cast_name_assign: !calendar?.cast_name_assign
          ? ''
          : `${calendar?.cast_name_assign}${calendar?.cast_id_assign ? `-B${calendar?.cast_id_assign}` : ''}`,
        cancel_cost: calendar?.cancel_cost ?? '',
        extend: calendar?.extend === 0 ? '' : 'あり',
        coupon: calendar?.coupon ?? '',
        price: formatCash(calendar?.price?.toString()) ?? '',
        status_pay: calendar?.status_pay === null ? '' : '済',
        request_description: calendar?.request_description ?? '',
      });
    });

    let ekycText = NOT_EKYC;
    if (listUserDetail?.status_ekyc === 0 && listUserDetail?.error_code === null) {
      ekycText = NOT_EKYC;
    }
    if (listUserDetail?.status_ekyc === 0 && listUserDetail?.error_code !== null) {
      ekycText = `${EKYC_NG}-${listUserDetail?.error_code}`;
    }
    if (listUserDetail?.status_ekyc === 1) {
      ekycText = EKYC_PENDING;
    }
    if (listUserDetail?.status_ekyc === 2) {
      ekycText = EKYC_OK;
    }

    const userDetailCsv: any = [
      ['氏名', '登録日', '顧客ID', 'ステージ'],
      [
        listUserDetail?.name,
        listUserDetail?.created_at,
        `A${listUserDetail?.id}`,
        RankUserItems[listUserDetail?.rank - 1]?.label || 'ー',
      ],
      [],
      [
        'メールアドレス',
        '生年月日',
        '性別',
        'ご職業',
        '住所',
        '最寄駅',
        '最寄駅からの移動手段',
        '移動手段の詳細',
        '最寄駅からの時間',
        '建物種別',
        'お家の広さ',
        '間取り',
        '階数',
        '支払い方法',
        'eKYC ステタス',
        'ヒアリングステータス',
        'パスワード',
      ],
      [
        listUserDetail?.email,
        convertDate(listUserDetail?.dob),
        listGender[listUserDetail?.gender - 1],
        JobItems[listUserDetail?.profession - 1]?.title,
        listUserDetail?.address,
        listUserDetail?.station,
        transportationItems[listUserDetail?.transportation - 1]?.title,
        listUserDetail?.note,
        listUserDetail?.station_time,
        BuildingType[listUserDetail?.building_type - 1]?.title,
        CapacityMItems[listUserDetail?.capacity_m - 1]?.title,
        CapacityKItems[listUserDetail?.capacity_k - 1]?.title,
        buildingHeightItems[listUserDetail?.building_height - 1]?.title,
        CardItems[listUserDetail?.card_type - 1]?.title,
        ekycText,
        items[listUserDetail?.status_hearing === 1 ? 1 : 0]?.label,
        listUserDetail?.password_description,
      ],
      [],
      ['ヒアリングメモ'],
      [listUserDetail?.memo_hearing ?? ''],
      [],
      [
        '依頼内容',
        '依頼日',
        '依頼時間',
        'キャスト',
        '指名キャスト',
        'キャンセル',
        '延長利用',
        'クーポン利用',
        '合計料金',
        '決済状況',
        '備考',
      ],
      ...(tmpDataCalendar ?? []),
      [],
      ['合計利用金額 (円)', '合計利用回数 (回)', '合計利用時間 (時間)'],
      [
        `${listUserDetail?.total_money}円`,
        `${listUserDetail?.total_use_service}回`,
        `${listUserDetail?.total_use_hour}時間`,
      ],
    ];
    setDataExportCSV(userDetailCsv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUserDetail, listCalendarUser]);

  // ---------------- END EFFECT ----------

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  // HANDLE HEARING
  const handleHearing: MenuProps['onClick'] = async ({ key }: { key: string }): Promise<void> => {
    try {
      let res: any;

      if (key === '1' && listUserDetail?.status_hearing !== Number(key)) {
        res = await dispatch(
          putHearingStatus({
            id,
            status_hearing: { status_hearing: 1 },
          }),
        );
      }
      if (key === '0' && listUserDetail?.status_hearing !== Number(key)) {
        res = await dispatch(
          putHearingStatus({
            id,
            status_hearing: { status_hearing: 2 },
          }),
        );
      }
      if (res?.payload?.status === 'success') {
        dispatch(getUserDetail(listUserDetail?.id));
        alertSuccess(api, '変更が完了しました。');
      } else {
      }
    } catch (error) {}
  };

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: 'メールアドレス',
      dataIndex: 'email',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 2,
      title: '生年月日',
      dataIndex: 'dob',
      width: '8.333%',
      render: (text, _) => <span>{convertDate(text) || 'ー'}</span>,
    },
    {
      key: 3,
      title: '性別',
      dataIndex: 'gender',
      width: '8.333%',
      render: (text, _) => <span>{text}</span>,
    },
    {
      key: 4,
      title: 'ご職業',
      dataIndex: 'profession',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 5,
      title: '住所',
      dataIndex: 'address',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 6,
      title: '最寄駅',
      dataIndex: 'station',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 7,
      title: '最寄駅からの移動手段',
      dataIndex: 'transportation',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 8,
      title: '移動手段の詳細',
      dataIndex: 'note',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 9,
      title: '最寄駅からの時間',
      dataIndex: 'station_time',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 10,
      title: '建物種別',
      dataIndex: 'building_type',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 11,
      title: 'お家の広さ',
      dataIndex: 'capacity_m',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 12,
      title: '間取り',
      dataIndex: 'capacity_k',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
  ];

  const columns2: ColumnsType<any> = [
    {
      key: 1,
      title: '階数',
      dataIndex: 'building_height',
      width: '8.333%',
      render: (_, record) => (
        <span>
          {record?.building_height !== null ? buildingHeightItems[+record?.building_height - 1]?.title : 'ー'}
        </span>
      ),
    },
    {
      key: 2,
      title: '支払い方法',
      dataIndex: 'card_type',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 3,
      title: 'eKYC ステタス',
      dataIndex: 'status_ekyc',
      width: '8.333%',
      render: (text, record) => {
        if (text === 0 && record?.error_code === null) {
          return <span>{NOT_EKYC}</span>;
        }
        if (text === 0 && record?.error_code) {
          return <span>{`${EKYC_NG}-${record?.error_code}`}</span>;
        }
        if (text === 1) {
          return <span>{`${EKYC_PENDING}`}</span>;
        }
        if (text === 2) {
          return <span>{`${EKYC_OK}`}</span>;
        }
      },
    },
    {
      key: 4,
      title: 'ヒアリングステータス',
      dataIndex: 'status_hearing',
      width: '8.333%',
      render: (text, _) => (
        <div className="btn-icon-dropdown">
          <span>{text}</span>
          <Dropdown
            menu={{ items, onClick: handleHearing }}
            overlayClassName="dropdown-hearing"
            trigger={['click']}
            placement={'bottomRight'}
          >
            <div>
              <Space>
                <CaretDownOutlined />
              </Space>
            </div>
          </Dropdown>
        </div>
      ),
    },
    {
      key: 5,
      title: 'パスワード',
      dataIndex: 'password_description',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      key: 6,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 7,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 8,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 9,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 10,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 11,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 12,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
    {
      key: 13,
      title: ' ',
      dataIndex: '',
      width: '8.333%',
    },
  ];

  const columns3: ColumnsType<any> = [
    {
      key: 13,
      title: '依頼内容',
      dataIndex: 'service_id',
      width: '11%',
      render: (text, _) => <span> {serviceItems[text - 1]?.label}</span>,
    },
    {
      key: 14,
      title: '依頼日',
      dataIndex: 'date',
      width: '9%',
      render: (text, _) => <span> {convertDate(text)}</span>,
    },
    {
      key: 15,
      title: '依頼時間',
      dataIndex: 'hour',
      width: '9%',
      render: (text, _) => <span>{`${text}時間`}</span>,
    },
    {
      key: 16,
      title: 'キャスト',
      dataIndex: 'cast_name_not_assign',
      width: '9%',
      render: (text, record) =>
        record?.cast_id_not_assign ? (
          <>
            {
              <Link to={`${config.routes.detailCast}/${record?.cast_id_not_assign}`}>
                {record?.cast_name_not_assign === null ? (
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
        ),
    },
    {
      key: 17,
      title: '指名キャスト',
      dataIndex: 'cast_name_assign',
      width: '9%',
      render: (text, record) => {
        return record?.cast_id_assign !== null ? (
          <>
            <Link to={`${config.routes.detailCast}/${record?.cast_id_assign}`}>
              <span className="underline">
                {text} <br />
                {!record?.cast_id_assign ? '' : `B${record?.cast_id_assign}`}
              </span>
            </Link>
          </>
        ) : (
          <span>ー</span>
        );
      },
    },
    {
      key: 18,
      title: 'キャンセル',
      dataIndex: 'cancel_cost',
      width: '9%',
      render: (text, _) => <span>{text !== null ? text : 'ー'}</span>,
    },
    {
      key: 19,
      title: '延長利用',
      dataIndex: 'extend',
      width: '9%',
      render: (text, _) => {
        return <span>{text === 0 ? 'ー' : 'あり'}</span>;
      },
    },
    {
      key: 20,
      title: 'クーポン利用',
      dataIndex: 'coupon',
      width: '9%',
      render: (text, _) => <span>{text ? text : 'ー'}</span>,
    },
    {
      key: 21,
      title: '合計料金',
      dataIndex: 'price',
      width: '9%',
      render: (text, _) => <span>{text ? text : 'ー'}</span>,
    },
    {
      key: 22,
      title: '決済状況',
      dataIndex: 'status_pay',
      width: '9%',
      render: (text, _) => <span>{text ? '済' : 'ー'}</span>,
    },
    {
      key: 23,
      title: '備考',
      dataIndex: 'request_description',
      width: '9%',
      render: (text, _) => <span>{text ?? 'ー'}</span>,
    },
    {
      key: 11,
      title: ' ',
      dataIndex: 'id',
      width: '6%',
      render: (_, record) => (
        <div className="item-icon-delete" onClick={() => showModal(record?.id)}>
          {record?.status_delete === 1 ? <DeleteOutlined /> : ''}
        </div>
      ),
    },
  ];

  // HANDLE MEMO DETAIL
  const handleMemoDetail = async (memo_hearing: any): Promise<void> => {
    setIsEditing(false);
    try {
      if (memo_hearing !== listUserDetail?.memo_hearing) {
        const res: any = await dispatch(putMemoHearing({ id, memo_hearing: { memo_hearing } }));
        if (res?.payload?.status === 'success') {
          dispatch(getUserDetail(listUserDetail?.id));
          alertSuccess(api, '変更が完了しました。');
        } else {
          alertFail(api, '変更に失敗しました。');
        }
      }
    } catch (error) {}
  };

  // HANDLE CANCEL MEMO HEARING
  const handleCancel = (): void => {
    setIsEditing(false);
    listUserDetail?.memo_hearing === null ? setMemoHearing('') : setMemoHearing(listUserDetail?.memo_hearing);
  };

  // SHOW BUTTON MEMO
  const showBtn = (): void => {
    refMemo?.current?.focus();
    setIsEditing(true);
  };

  // HANDLE RANK
  const handleRankItem: MenuProps['onClick'] = async ({ key }: any): Promise<void> => {
    try {
      if (Number(key) !== listUserDetail?.rank) {
        const res: any = await dispatch(putRankUser({ id, rank: { rank: key } }));
        if (res?.payload?.status === 'success') {
          dispatch(getUserDetail(listUserDetail?.id));
          alertSuccess(api, '変更が完了しました。');
        } else {
          alertSuccess(api, '変更に失敗しました。');
        }
      }
    } catch (error) {}
  };

  // SHOW MODAL
  const showModal = (id: any): void => {
    setIsModalOpen(true);
    setIdMatching(id);
  };

  // HANDLE DELETE MATCHING
  const handleDeleteMatching = async (): Promise<void> => {
    try {
      const res: any = await dispatch(deleteUserMatching(idMatching));
      if (res?.payload?.status === 'success') {
        dispatch(getCalendarUser(id));
        alertSuccess(api, '変更が完了しました。');
        setIsModalOpen(false);
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    } catch (error) {}
  };

  //  HANDLE CANCEL DELETE
  const handleCancelDelete = (): void => {
    setIsModalOpen(false);
  };

  // FOOTER
  const customerDetailFooter: JSX.Element = (
    <div className="btn-modal-delete-matching">
      <Button key="back" onClick={handleCancelDelete} className="btn-back">
        一覧に戻る
      </Button>
      <Button key="submit" type="primary" className="btn-delete-matching" onClick={handleDeleteMatching}>
        キャンセルする
      </Button>
    </div>
  );

  return (
    <div className="customer-detail-content">
      {showPopup}
      <Modal
        title={''}
        open={isModalOpen}
        className="modal-delete-matching"
        closable={false}
        footer={[customerDetailFooter]}
        onCancel={handleCancelDelete}
        closeIcon={<></>}
      >
        <h3 className="title-delete-matching">このマッチング1件をキャンセル(無効)しますか? </h3>
        <span className="delete-content">一度キャンセルを押すと元に戻せません。</span>
      </Modal>
      <div className="csv-block">
        <CSVLink target="_blank" data={dataExportCSV ? dataExportCSV : []} filename={`customer-detail-export.csv`}>
          <button> CSV出力</button>
        </CSVLink>
      </div>
      <div className="admin-input-group customer-detail-input">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 氏名 </span>
          </div>
          <input className="input-admin-global disable" type="text" value={listUserDetail?.name || 'ー'} readOnly />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 登録日</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={convertDate(listUserDetail?.created_at) || 'ー'}
            readOnly
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 顧客ID</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={listUserDetail?.id ? `A${listUserDetail?.id}` : 'ー'}
            readOnly
          />
        </div>
        <div className="admin-input-item rank-item">
          <div className="admin-listct-label">
            <span>ステージ</span>
          </div>
          <div className="input-admin-global disable">
            <div className="btn-icon-dropdown">
              <span className="rank-item-admin">
                {listUserDetail?.rank === null ? 'ー' : RankUserItems[listUserDetail?.rank - 1]?.label}
              </span>
            </div>
          </div>
          <Space>
            <Dropdown
              menu={{ items: RankUserItems, onClick: handleRankItem }}
              trigger={['click']}
              overlayClassName="dropdown-detail"
              placement={'bottomRight'}
              overlayStyle={{ minWidth: '100px' }}
              getPopupContainer={() => {
                let rankSelect: any = document.body.getElementsByClassName('rank-item');
                return rankSelect[0];
              }}
            >
              <button onClick={() => handleRankItem} style={{ textDecoration: 'underline' }}>
                編集
              </button>
            </Dropdown>
          </Space>
        </div>
      </div>

      <div className="detail-user-table">
        <Table
          dataSource={formattedListUser}
          columns={columns}
          bordered={true}
          size="small"
          pagination={false}
          rowKey="key"
        />
        <Table
          dataSource={formattedListUser}
          columns={columns2}
          bordered={true}
          size="small"
          pagination={false}
          rowKey="key"
        />
      </div>
      <div className="interview-notes note-detail-block ">
        <div className="title">
          <span>ヒアリングメモ</span>
        </div>
        <div className="interview-notes-content">
          <textarea
            name="note-audit-detail"
            placeholder="移動手段の詳細や、ヒアリング時のメモを記載してください"
            value={memoHearing}
            ref={refMemo}
            onChange={(e: any) => setMemoHearing(e.target.value)}
            className="textarea-content-detail"
            readOnly={!isEditing}
          />
          <button className="redact" onClick={showBtn}>
            {isEditing ? `` : '編集'}
          </button>
        </div>
        <div className={`block-detail ${isEditing ? '' : 'hidden'} `}>
          <button className="btn-save-detail" onClick={() => handleMemoDetail(memoHearing)}>
            保存
          </button>
          <button className="btn-save-detail" onClick={handleCancel}>
            キャンセル
          </button>
        </div>
      </div>
      <div className="month-used-admin">
        <h2>{month}月の利用状況</h2>
        <div className="table-block-user">
          <Table
            dataSource={formattedListCalendar}
            columns={columns3}
            bordered={true}
            size="small"
            pagination={false}
            rowKey="key"
          />
        </div>
        <div className="admin-input-group ">
          <div className="admin-input-item ">
            <div className="admin-listct-label label-center">
              <span>合計利用金額 (円)</span>
            </div>
            <input
              className="input-admin-global disable"
              type="text"
              value={listUserDetail?.total_money ?? ''}
              readOnly
            />
          </div>

          <div className="admin-input-item">
            <div className="admin-listct-label">
              <span>合計利用回数 (回)</span>
            </div>
            <input
              className="input-admin-global disable"
              type="text"
              value={listUserDetail?.total_use_service ?? ''}
              readOnly
            />
          </div>
          <div className="admin-input-item">
            <div className="admin-listct-label">
              <span> 合計利用時間 (時間)</span>
            </div>
            <input
              className="input-admin-global disable"
              type="text"
              value={listUserDetail?.total_use_hour ?? ''}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
