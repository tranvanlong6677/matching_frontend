import { Button, Form, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import iconCalendar from '../../../../assets/images/mockup/iconCalendar.svg';
import { getLocalStorage, setLocalStorage } from '../../../../helper/common';
import { serviceNowItems } from '../../../../utils/customerServiceItems';
import CheckboxCustom from '../../../../components/checkboxCustom';
import image from '../../../../assets/images/index';
import config from '../../../../config';

const ChooseService = () => {
  const navigate: NavigateFunction = useNavigate();
  const [formScheduleService]: [FormInstance] = Form.useForm();

  // HOOK STATE
  const [saveCheckboxId, setSaveCheckboxId]: [any, React.Dispatch<any>] = useState<any>(null);

  // GET DATA LOCAL
  const serviceData = getLocalStorage('srv');

  const serviceDescription: any = [
    {
      id: 1,
      title: '掃除代行サービス詳細',
      description: (
        <>
          <span style={{ color: '#000', whiteSpace: 'nowrap' }}>
            お客様のご要望に合わせて、お家のお掃除を行います。
          </span>
          <br />
          忙しいお客様に代わって、お掃除でいつもキレイに心地いい空間づくりをお手伝いします。
          <br />
          ※最低契約時間：2時間～とさせていただきます。
        </>
      ),
      icon: image.iconClean,
    },
    {
      id: 2,
      title: '整理・整頓サービス詳細',
      description: (
        <>
          <span style={{ color: '#000', whiteSpace: 'nowrap', letterSpacing: '-1.2px' }}>
            お客様のご要望に応じて、お家の中の整理整頓を行います。
          </span>
          <br />
          なかなかご自身では気づけ無い整理整頓方法をご提案し、お家の中をスッキリいたします。
        </>
      ),
      icon: image.iconBlock,
    },
    {
      id: 3,
      title: '料理代行サービス詳細',
      description: (
        <>
          お客様のご要望に応じて、忙しいお客様に代わって料理をいたします。食材や味付けもご要望に応じますし、ひと味ちがう献立をお楽しみください。
        </>
      ),
      icon: image.iconPan,
    },
  ];

  useEffect((): void => {
    if (serviceData !== null) {
      formScheduleService.setFieldValue('service_id', serviceData);
      setSaveCheckboxId(serviceData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceData]);

  const handleCheckboxAnt = (value: any): void => {
    setSaveCheckboxId(value);
  };

  // HANDLE SUBMIT
  const onSubmit = (): void => {
    if (serviceData !== null) {
      if (serviceData !== saveCheckboxId) {
        localStorage.removeItem('cast');
        localStorage.removeItem('cse');
        localStorage.removeItem('srv');
      }
    }
    setLocalStorage('srv', saveCheckboxId);
    navigate(config.routes.customerScheduleDetail);
  };

  return (
    <div className="booking-container container-680">
      <div className="title">
        <img src={iconCalendar} alt="" />
        <h1>依頼予約</h1>
      </div>
      <div className="question">
        <h1 className="question-title">ご依頼内容を選択ください。</h1>
        <span className="instruct">チェックボックスを選択すると各サービスの詳細を確認できます。</span>
        <div className="form-calendar-request">
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            form={formScheduleService}
            autoComplete="off"
            onFinish={onSubmit}
          >
            <div className="choose-service-form">
              <Form.Item name="service_id">
                <CheckboxCustom
                  onChange={handleCheckboxAnt}
                  options={serviceNowItems}
                  value={saveCheckboxId}
                  vertical
                />
              </Form.Item>
              <div className={'choose-service-bottom'}>
                {saveCheckboxId && (
                  <div className="service-detail">
                    <div className="service-detail-title">
                      <img src={serviceDescription[saveCheckboxId - 1]?.icon} alt="Error" />
                      <h2>{serviceDescription[saveCheckboxId - 1]?.title}</h2>
                    </div>
                    <div className="service-detail-description">
                      {saveCheckboxId?.length === 0 ? '' : serviceDescription[saveCheckboxId - 1]?.description}
                    </div>
                  </div>
                )}
                {!saveCheckboxId && (
                  <Button className={'btn btn-request cr-allow btn-large'}>依頼履歴から選択する</Button>
                )}
              </div>
            </div>

            <div className="btn-calendar-request">
              <div className="button-block">
                <Button
                  htmlType="submit"
                  className={`btn ${!!saveCheckboxId ? 'btn-customer' : ''}`}
                  disabled={!!saveCheckboxId ? false : true}
                >
                  次へ
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChooseService;
