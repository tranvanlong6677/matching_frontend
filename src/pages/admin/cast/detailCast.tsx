import _ from 'lodash';
import { CSVLink } from 'react-csv';
import type { MenuProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Input, Modal, Space, Table, notification } from 'antd';

import { alertFail, alertSuccess, formatCash } from '../../../helper/common';
import { availableServiceItems } from '../../../utils/availableServiceItems';
import { transportationItems } from '../../../utils/transportationItems';
import { hourScheduleItems } from '../../../utils/hourScheduleItems';
import { serviceItems } from '../../../utils/customerServiceItems';
import { castExperience } from '../../../utils/castExperience';
import { rankCastItems } from '../../../utils/rankCastItems';
import { salaryItems } from '../../../utils/salaryItems';
import { listGender } from '../../../utils/genderItems';
import config from '../../../config/index';
import {
  deleteCastMatching,
  getAllCalendarCurrentMonth,
  getCastDetail,
  putAuditStatus,
  putMemoAudit,
  putRankCast,
  putRankUser,
  putTrainingStatus,
  putUpdateSalary,
  putUpdateSalaryHour,
} from '../../../redux/services/adminSlice';

const accountType: any = [
  {
    label: '普通',
    value: 0,
  },
  {
    label: '当座',
    value: 1,
  },
  {
    label: '貯蓄',
    value: 2,
  },
];

const statusAudit: any = [
  {
    label: '完了',
    key: '1',
  },
  {
    label: '未完了',
    key: '0',
  },
];
const statusTraining: any = [
  {
    label: '完了',
    key: '1',
  },
  {
    label: '未完了',
    key: '0',
  },
];

const DetailCast = () => {
  const { id }: any = useParams();
  const dispatch: Dispatch<any> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [api, showPopup]: any = notification.useNotification();

  // HOOK REF
  const refMemoAudit: any = useRef<any>(null);
  const refSalaryHour: any = useRef<any>(null);
  const refActionsSalary: any = useRef<any>();

  // HOOK STATE
  const [stage, setStage]: [any, React.Dispatch<any>] = useState('');
  const [idMatching, setIdMatching]: [any, React.Dispatch<any>] = useState();
  const [detailCast, setDetailCast]: [any, React.Dispatch<any>] = useState<any>([]);
  const [salary, setSalary]: [any, React.Dispatch<any>] = useState<number | string>();
  const [isModalOpen, setIsModalOpen]: [boolean, React.Dispatch<any>] = useState(false);
  const [detailCastCSV, setDetailCastCSV]: [any, React.Dispatch<any>] = useState<any>([]);
  const [salaryHour, setSalaryHour]: [any, React.Dispatch<any>] = useState<number | string>();
  const [showActionSalary, setShowActionSalary]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [isShowButtonSalary, setIsShowButtonSalary]: [boolean, React.Dispatch<any>] = useState<boolean>(false);
  const [calendarCurrentMonthState, setCalendarCurrentMonthState]: [any, React.Dispatch<any>] = useState<any>([]);
  const [isShowButtonInterviewMemo, setIsShowButtonInterviewMemo]: [boolean, React.Dispatch<any>] =
    useState<boolean>(false);

  // REDUCER
  const { castDetail, calendarCurrentMonth } = useSelector((state: any) => state.adminReducer);

  // HOOK EFFECT
  useEffect(() => {
    dispatch(getCastDetail(id));
    dispatch(getAllCalendarCurrentMonth(id));
  }, [id, dispatch]);

  useEffect(() => {
    // sort calendarCurrentMonth
    let calendarCurrentMonthClone = calendarCurrentMonth?.map((item: any, index: any) => {
      let dateFormat: Date = new Date(item?.date);
      return { ...item, dateFormat: dateFormat, key: `item-${index}` };
    });

    calendarCurrentMonthClone?.sort((a: any, b: any) => b?.dateFormat - a?.dateFormat);

    setCalendarCurrentMonthState([]);

    if (calendarCurrentMonthClone && calendarCurrentMonthClone?.length > 0) {
      let dataCalendarCast = calendarCurrentMonthClone?.map((item: any, index: any) => {
        return { ...item, address: `${item.city}-${item.province}`, key: `item-${index}` };
      });
      setCalendarCurrentMonthState(dataCalendarCast);
    }
  }, [calendarCurrentMonth]);

  useEffect((): void => {
    if (castDetail) {
      setSalary(castDetail?.total_salary);
      setSalaryHour(castDetail?.salary_hour);
      setStage(castDetail?.memo_audit);
      setDetailCast([{ ...castDetail, key: 1 }]);

      const tmpDataCurrentMonths = calendarCurrentMonthState?.map((item: any) => {
        return _.values({
          service: serviceItems[item?.service_id - 1]?.label ?? '',
          date: convertDate(item?.date) ?? '',
          hour: hourScheduleItems[item?.hour - 2]?.title ?? '',
          user_name: item?.user_name ? `${item?.user_name}${item?.user_id ? `-A${item?.user_id}` : ''}` : '',
          address: item?.address ?? '',
          price: formatCash(item?.price.toString()) ?? '',
          extend: item?.extend === 0 ? '' : 'あり',
          cancel: item?.cancel ?? '',
          assign: item?.assign === null || item?.assign === undefined ? '' : 'あり',
          coupon: item?.coupon === null ? '' : 'あり',
          request_description: item?.request_description || '',
        });
      });

      const castDataExportCSV: any = [
        ['氏名', '登録日', 'キャストID', 'ランク'],
        [
          castDetail?.name,
          convertDate(castDetail?.created_at),
          `B${castDetail?.id}`,
          `${rankCastItems[castDetail?.rank - 1]?.label || '#1'} `,
        ],
        [],
        [
          'メールアドレス',
          '生年月日',
          '性別',
          '住所',
          '最寄駅',
          '最寄駅からの移動手段',
          '最寄駅からの時間',
          '緊急連絡先',
          '緊急連絡先氏名',
          '緊急連絡先続柄',
          '家事経験年数',
          '可能提供サービス',
        ],
        [
          castDetail?.email,
          convertDate(castDetail?.dob),
          listGender[+castDetail?.gender - 1],
          castDetail?.address,
          castDetail?.station,
          transportationItems[+castDetail?.transportation]?.title,
          castDetail?.station_time,
          castDetail?.ecn,
          castDetail?.etc_name,
          castDetail?.etc_relationship,
          castExperience[+castDetail?.year_experience - 1]?.title,
          availableServiceItems[+castDetail?.available_service - 1]?.title,
        ],
        [],
        [
          'ご希望の月額報酬',
          '金融機関名',
          '支店名',
          '預金種別',
          '口座番号',
          '口座名義',
          '面談ステータス',
          'トレーニングステータス',
          'パスワード',
        ],
        [
          '',
          castDetail?.bank_name,
          castDetail?.store_name,
          accountType[castDetail?.account_type - 1]?.label,
          castDetail?.account_number,
          castDetail?.account_name,
          statusAudit[castDetail?.audit_status]?.label,
          statusTraining[castDetail?.training_status]?.label,
          castDetail?.password_description,
        ],
        [],
        ['面談メモ'],
        [castDetail?.memo_audit],
        [],
        ['キャスト時給 (円)'],
        [`${castDetail?.salary_hour?.toString}円`],
        [],
        ['給与金額 (円)', '出勤回数 (数)', '出勤時間 (時間)', '交通費 (円)', '指名回数 (回)'],
        [
          `${castDetail?.total_salary?.toString()}`,
          `${castDetail?.total_work?.toString()}`,
          `${castDetail?.total_hour?.toString()}`,
          `${castDetail?.total_transportation_fee?.toString()}`,
          `${castDetail?.total_assign?.toString()}`,
        ],
        [],
        [
          '依頼内容',
          '依頼日',
          '依頼時間',
          '依頼者',
          '住所',
          '料金',
          '延長',
          'キャンセル',
          '指名',
          'クーポン利用',
          '備考',
        ],
        ...tmpDataCurrentMonths,
      ];
      setDetailCastCSV(castDataExportCSV);
    }
  }, [castDetail, calendarCurrentMonthState]);

  // HANDLE DATE
  const date: Date = new Date();
  const month: number = date.getMonth() + 1;

  // HANDLE RANK
  const handleRankItem: MenuProps['onClick'] = async ({ key }: { key: string }): Promise<void> => {
    try {
      if (Number(key) !== castDetail?.rank) {
        let res: any = await dispatch(putRankCast({ id, rank: { rank: key } }));
        if (res?.payload?.status === 'success') {
          dispatch(getCastDetail(castDetail?.id));
          alertSuccess(api, '変更が完了しました。');
        } else {
          alertFail(api, '変更に失敗しました。');
        }
      }
    } catch (error) {}
  };

  // HANDLE INTERVIEW
  const handleInterviewMemo = async (): Promise<void> => {
    if (id) {
      let res: any = await dispatch(putMemoAudit({ id: +id, memo_audit: stage }));
      if (res?.payload?.status === 'success') {
        alertSuccess(api, '変更が完了しました。');
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    }
    setIsShowButtonInterviewMemo(false);
  };

  // HANDLE SAVE SALARY
  const handleSaveSalary = async (): Promise<void> => {
    let res: any = await dispatch(putUpdateSalaryHour({ id, salaryHour: salaryHour }));
    if (res?.payload?.status === 'success') {
      await dispatch(getCastDetail(id));
      alertSuccess(api, '変更が完了しました。');
    } else {
      alertFail(api, '変更に失敗しました。');
    }
    setIsShowButtonSalary(false);
  };

  // SHOW MODAL
  const showModal = (id: any): void => {
    setIsModalOpen(true);
    setIdMatching(id);
  };

  // CONVERT DATE
  const convertDate = (date: any) => {
    return date?.replace(/-/g, '/');
  };

  // COLUMNS
  const columns1: ColumnsType<any> = [
    {
      title: 'メールアドレス',
      dataIndex: 'email',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 1,
    },
    {
      title: '生年月日',
      dataIndex: 'dob',
      width: '8.333%',
      render: (text: string) => <span>{text ? convertDate(text) : 'ー'}</span>,
      key: 2,
    },
    {
      title: '性別',
      dataIndex: 'gender',
      width: '8.333%',
      render: (text: string) => <span>{text ? `${listGender[+text - 1]}` : 'ー'}</span>,
      key: 3,
    },
    {
      title: '住所',
      dataIndex: 'address',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 4,
    },
    {
      title: '最寄駅',
      dataIndex: 'station',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 5,
    },
    {
      title: '最寄駅からの移動手段',
      dataIndex: 'transportation',
      width: '8.333%',
      render: (text: string) => <span>{transportationItems[+text]?.title || 'ー'}</span>,
      key: 6,
    },
    {
      title: '最寄駅からの時間',
      dataIndex: 'station_time',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 7,
    },
    {
      title: '緊急連絡先',
      dataIndex: 'ecn',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 8,
    },
    {
      title: '緊急連絡先氏名',
      dataIndex: 'etc_name',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 9,
    },
    {
      title: '緊急連絡先続柄',
      dataIndex: 'etc_relationship',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 10,
    },
    {
      title: '家事経験年数',
      dataIndex: 'year_experience',
      width: '8.333%',
      render: (text: string) => <span>{text ? `${castExperience[+text - 1]?.title}` : 'ー'}</span>,
      key: 11,
    },
    {
      title: '可能提供サービス',
      dataIndex: 'available_service',
      width: '8.333%',
      render: (text: string) => <span>{text ? `${serviceItems[+text - 1]?.label}` : 'ー'}</span>,
      key: 12,
    },
  ];
  const columns2: ColumnsType<any> = [
    {
      title: 'ご希望の月額報酬',
      dataIndex: 'salary',
      width: '8.333%',
      render: (text: string) => {
        return <span>{salaryItems[+text - 1]?.title ? `${salaryItems[+text - 1]?.title}` || 'ー' : 'ー'}</span>;
      },
      key: 13,
    },
    {
      title: '金融機関名',
      dataIndex: 'bank_name',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 14,
    },
    {
      title: '支店名',
      dataIndex: 'store_name',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 15,
    },
    {
      title: '預金種別',
      dataIndex: 'account_type',
      width: '8.333%',
      render: (text: string) => <span>{accountType[+text - 1]?.label || 'ー'}</span>,
      key: 16,
    },
    {
      title: '口座番号',
      dataIndex: 'account_number',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 17,
    },
    {
      title: '口座名義',
      dataIndex: 'account_name',
      width: '8.333%',
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
      key: 18,
    },
    {
      title: '面談ステータス',
      dataIndex: 'audit_status',
      width: '8.333%',
      render: (text: string, _: any, __: number) => {
        return (
          <div className="btn-icon-dropdown">
            <span>{+text === 1 ? '完了' : +text === 0 ? '未完了' : ''}</span>
            <Dropdown
              menu={{
                items: statusAudit,
                onClick: async (e: any): Promise<void> => {
                  if (+e?.key !== +castDetail?.audit_status && id) {
                    let res: any = await dispatch(putAuditStatus({ id: +id, audit_status: +e?.key }));

                    if (res?.payload?.status === 'success') {
                      alertSuccess(api, '変更が完了しました。');
                      await dispatch(getCastDetail(id));
                    } else {
                      alertFail(api, '変更に失敗しました。');
                    }
                  }
                },
              }}
              trigger={['click']}
              overlayClassName="dropdown-hearing"
              placement={'bottomRight'}
            >
              <div
                onClick={(e: React.MouseEvent<any>): void => {
                  e.preventDefault();
                }}
              >
                <Space>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </div>
        );
      },
      key: 19,
    },

    {
      title: 'トレーニングステータス',
      dataIndex: 'training_status',
      width: '8.333%',
      render: (text: string, _: any, __: number) => (
        <div className="btn-icon-dropdown">
          <span>{+text === 0 ? '未完了' : +text === 1 ? '完了' : ''}</span>
          <Dropdown
            menu={{
              items: statusTraining,
              onClick: async (e: any): Promise<void> => {
                if (+e?.key !== +castDetail?.training_status && id) {
                  let res: any = await dispatch(putTrainingStatus({ id: +id, training_status: +e?.key }));
                  if (res?.payload?.status === 'success') {
                    alertSuccess(api, '変更が完了しました。');
                    await dispatch(getCastDetail(id));
                  } else {
                    alertFail(api, '変更に失敗しました。');
                  }
                }
              },
            }}
            trigger={['click']}
            placement={'bottomRight'}
            overlayClassName="dropdown-hearing"
          >
            <div onClick={(e: any) => e.preventDefault()}>
              <Space>
                <CaretDownOutlined />
              </Space>
            </div>
          </Dropdown>
        </div>
      ),
      key: 20,
    },
    {
      title: 'パスワード',
      dataIndex: 'password_description',
      width: '8.333%',
      render: (text, _) => <span>{text || 'ー'}</span>,
    },
    {
      title: ' ',
      dataIndex: '',
      width: '8.333%',
      key: 22,
    },
    {
      title: ' ',
      dataIndex: '',
      width: '8.333%',
      key: 23,
    },
    {
      title: ' ',
      dataIndex: '',
      width: '8.333%',
      key: 24,
    },
  ];
  const columns3: ColumnsType<any> = [
    {
      title: '依頼内容',
      dataIndex: 'service_id',
      width: '8%',
      key: 25,
      render: (text: string, _: any, __: number) => {
        return <span>{text ? serviceItems[+text - 1]?.label : 'ー'}</span>;
      },
    },
    {
      title: '依頼日',
      dataIndex: 'date',
      width: '8%',
      key: 26,
      render: (text: string) => {
        return <span>{text ? `${convertDate(text)}` : 'ー'}</span>;
      },
    },
    {
      title: '依頼時間',
      dataIndex: 'hour',
      width: '8%',
      key: 27,
      render: (text: string, _: any, __: number) => {
        return <span>{text ? `${text}時間` : 'ー'}</span>;
      },
    },
    {
      title: '依頼者',
      dataIndex: 'user_name',
      width: '8%',
      key: 28,
      render: (text: string, record: any, _: number): any => {
        return record?.user_id !== null ? (
          <div className="underline">
            {text === null ? (
              <span>ー</span>
            ) : (
              <Link to={`${config.routes.adminCustomerDetail}/${record?.user_id}`}>
                <div className="name-assign">
                  <span>
                    {record?.user_name} <br />
                    {record?.user_id ? `A${record?.user_id}` : ''}
                  </span>
                </div>
              </Link>
            )}
          </div>
        ) : (
          <span>ー</span>
        );
      },
    },
    {
      title: '住所',
      dataIndex: 'address',
      width: '8%',
      key: 29,
      render: (text: string) => <span>{text ? text : 'ー'}</span>,
    },
    {
      title: '料金',
      dataIndex: 'price',
      width: '8%',
      key: 30,
      render: (text: string, _: any, __: number) => {
        return <span>{text ? formatCash(text.toString()) : 'ー'}</span>;
      },
    },
    {
      title: '延長',
      dataIndex: 'extend',
      width: '8%',
      key: 31,
      render: (text: string, record: any, _: number) => {
        return <span>{record?.extend === 1 ? 'あり' : 'ー'}</span>;
      },
    },
    {
      title: 'キャンセル',
      dataIndex: 'cancel',
      width: '8%',
      key: 32,
      render: (text: string, _: any, __: number) => {
        return <span>{text ? text : 'ー'}</span>;
      },
    },
    {
      title: '指名',
      dataIndex: 'assign',
      width: '8%',
      key: 33,
      render: (text: string, record: any, _: number) => {
        return <span>{record?.assign !== null ? 'あり' : 'ー'}</span>;
      },
    },
    {
      title: 'クーポン利用',
      dataIndex: 'coupon',
      width: '8%',
      key: 34,
      render: (text: string, record: any, _: number) => {
        return <span>{record?.coupon !== null ? 'あり' : 'ー'}</span>;
      },
    },
    {
      key: 35,
      title: '備考',
      dataIndex: 'request_description',
      width: '8%',
      render: (text, _) => <span>{text ?? 'ー'}</span>,
    },
    {
      title: '',
      dataIndex: 'id',
      width: '3%',
      render: (text, record) => (
        <>
          <div className="item-icon-delete" onClick={() => showModal(record?.id)}>
            {record?.status_delete === 1 ? <DeleteOutlined /> : ''}
          </div>
        </>
      ),
    },
  ];

  // HANDLE ACTIONS SALARY
  const handleActionsSalary = (): void => {
    setShowActionSalary(!showActionSalary);
    refActionsSalary.current.focus();
    if (!salaryHour) {
      setSalaryHour('');
    }
  };

  // HANDLE SAVE ACTIONS SALARY
  const handleSaveActionsSalary = async (): Promise<void> => {
    try {
      const res: any = await dispatch(putUpdateSalary({ id, salary: salary }));
      if (res?.payload?.status === 'success') {
        setShowActionSalary(false);
        dispatch(getCastDetail(id));
        alertSuccess(api, '変更が完了しました。');
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    } catch (err) {
      alertFail(api, '変更に失敗しました。');
    }
  };

  // HANDLE DELETE MATCHING
  const handleDeleteMatching = async (): Promise<void> => {
    try {
      const res: any = await dispatch(deleteCastMatching(idMatching));
      if (res?.payload?.status === 'success') {
        dispatch(getCastDetail(id));
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

  const detailCastFooter: JSX.Element = (
    <div className="btn-modal-delete-matching">
      <Button key="back" onClick={handleCancel} className="btn-back">
        一覧に戻る
      </Button>
      <Button key="submit" type="primary" className="btn-delete-matching" onClick={handleDeleteMatching}>
        キャンセルする
      </Button>
    </div>
  );

  return (
    <div className="detail-cast-wrapper">
      {showPopup}
      <Modal
        title={''}
        open={isModalOpen}
        className="modal-delete-matching"
        closable={false}
        footer={[detailCastFooter]}
        onCancel={handleCancel}
        closeIcon={<></>}
      >
        <h3 className="title-delete-matching">このマッチング1件をキャンセル(無効)しますか? </h3>
        <span className="delete-content">一度キャンセルを押すと元に戻せません。</span>
      </Modal>
      <div className="csv-block">
        <CSVLink target="_blank" data={detailCastCSV ? detailCastCSV : []} filename={`cast-detail-export-${id}.csv`}>
          <button className="csv">CSV出力</button>
        </CSVLink>
      </div>
      <div className="admin-input-group">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 氏名</span>
          </div>
          <input
            type="text"
            readOnly
            className="input-admin-global disable"
            value={castDetail?.name ? castDetail?.name : 'ー'}
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 登録日</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={castDetail?.created_at ? convertDate(castDetail?.created_at) : 'ー'}
            readOnly
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> キャストID</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={castDetail?.id ? `B${castDetail?.id}` : 'ー'}
            readOnly
          />
        </div>
        <div className="admin-input-item rank-item">
          <div className="admin-listct-label">
            <span>ランク</span>
          </div>
          <div className="input-admin-global disable">
            <div className="btn-icon-dropdown">
              <span className="rank-item-admin">
                {castDetail?.rank === null ? '#1' : rankCastItems[castDetail?.rank - 1]?.label}
              </span>
            </div>
          </div>
          <Space>
            <Dropdown
              trigger={['click']}
              placement={'bottomRight'}
              overlayClassName="dropdown-detail"
              menu={{ items: rankCastItems, onClick: handleRankItem }}
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
      <Table
        rowKey={'key'}
        bordered={true}
        loading={false}
        columns={columns1}
        pagination={false}
        dataSource={detailCast}
      />
      <div className="block-table">
        <Table
          rowKey={'key'}
          bordered={true}
          loading={false}
          pagination={false}
          columns={columns2}
          dataSource={detailCast}
        />
      </div>
      <div className="interview-notes">
        <div className="title">
          <span>面談メモ</span>
        </div>
        <div className="interview-notes-content">
          <textarea
            name="interview_memo"
            id=""
            className={isShowButtonInterviewMemo ? '' : 'disable'}
            value={stage ? stage : ''}
            readOnly={!isShowButtonInterviewMemo}
            onChange={(e: React.ChangeEvent<any>): void => {
              setStage(e.target.value);
            }}
            ref={refMemoAudit}
            placeholder={'面談時のメモを記載してください'}
          ></textarea>
          {!isShowButtonInterviewMemo && (
            <span
              style={{ textDecoration: 'underline' }}
              className="redact"
              onClick={(): void => {
                setIsShowButtonInterviewMemo(!isShowButtonInterviewMemo);
                refMemoAudit.current.focus();
              }}
            >
              編集
            </span>
          )}
        </div>

        {isShowButtonInterviewMemo && (
          <div className="button-interview-block block-detail">
            <button className="btn-save-detail" onClick={() => handleInterviewMemo()}>
              保存
            </button>
            <button
              className="btn-save-detail"
              onClick={(): void => {
                setStage(castDetail?.memo_audit);
                setIsShowButtonInterviewMemo(false);
              }}
            >
              キャンセル
            </button>
          </div>
        )}
      </div>
      <div className="admin-input-group salary-hour">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> キャスト時給 (円)</span>
          </div>
          <Input
            className="input-admin-global"
            type="number"
            readOnly={!isShowButtonSalary}
            value={salaryHour ? salaryHour : ''}
            placeholder={!isShowButtonSalary || salaryHour ? 'ー' : ''}
            onChange={(e: any): void => {
              setSalaryHour(e.target.value);
            }}
            ref={refSalaryHour}
          />
          {!isShowButtonSalary && (
            <button
              onClick={(): void => {
                setIsShowButtonSalary(!isShowButtonSalary);
                refSalaryHour.current.focus();
                if (!salaryHour) {
                  setSalaryHour('');
                }
              }}
              style={{ textDecoration: 'underline' }}
            >
              編集
            </button>
          )}
        </div>
        {isShowButtonSalary && (
          <div className="button-salary-block block-detail">
            <button className="btn-save-detail" onClick={() => handleSaveSalary()}>
              保存
            </button>
            <button
              className="btn-save-detail"
              onClick={(): void => {
                setSalaryHour(castDetail?.salary_hour);
                setIsShowButtonSalary(false);
              }}
            >
              キャンセル
            </button>
          </div>
        )}
      </div>
      <div className="admin-input-group cast-bottom">
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 給与金額 (円)</span>
          </div>
          <input
            className="input-admin-global input-salary"
            type="text"
            value={salary ?? ''}
            placeholder={showActionSalary ? '' : 'ー'}
            readOnly={!showActionSalary}
            ref={refActionsSalary}
            onChange={(e: any): any => {
              setSalary(e.target.value);
            }}
          />
          <button onClick={handleActionsSalary} style={{ textDecoration: 'underline' }}>
            編集
          </button>
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 出勤回数 (数) </span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={`${castDetail?.total_work ?? ''}`}
            readOnly
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 出勤時間 (時間)</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={`${castDetail?.total_hour ?? ''}`}
            readOnly
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 交通費 (円)</span>
          </div>
          <input
            className="input-admin-global disable"
            type="text"
            value={`${castDetail?.total_transportation_fee ?? ''}`}
          />
        </div>
        <div className="admin-input-item">
          <div className="admin-listct-label">
            <span> 指名回数 (回)</span>
          </div>
          <input className="input-admin-global disable" type="text" value={`${castDetail?.total_assign ?? ''}`} />
        </div>
      </div>
      <div>
        {showActionSalary ? (
          <div className="button-salary-block block-detail">
            <button className="btn-save-detail" onClick={handleSaveActionsSalary}>
              保存
            </button>
            <button
              className="btn-save-detail"
              onClick={(): void => {
                setSalary(castDetail?.total_salary);
                setShowActionSalary(false);
              }}
            >
              キャンセル
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
      <span className="title-month">{month}月の代行一覧</span>
      <div className="table-calendar-current-month">
        <Table
          bordered={true}
          loading={false}
          columns={columns3}
          pagination={false}
          dataSource={calendarCurrentMonthState ? calendarCurrentMonthState : []}
          rowClassName={(_, index: number): string => (index % 2 !== 1 ? '' : 'row-color')}
        />
      </div>
      <div className="navigate">
        <span
          onClick={(): void => {
            navigate(`${config.routes.adminCalendarCast}/${id}`);
          }}
        >
          シフト管理ページへ 》
        </span>
      </div>
    </div>
  );
};

export default DetailCast;
