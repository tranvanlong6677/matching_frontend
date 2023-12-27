import { useDispatch } from 'react-redux';
import { Button, Form, Space, Upload } from 'antd';
import useNotification from 'antd/es/notification/useNotification';

import { postCouponUser } from '../../../redux/services/adminSlice';
import { alertFail, alertSuccess } from '../../../helper/common';
import { Dispatch } from 'react';
import adminApi from '../../../api/adminApi/adminApi';
import { AxiosResponse } from 'axios';

const CouponCode = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const [api, showPopup]: any = useNotification();

  // HANDLE FINISH
  const onFinish = async (values: any): Promise<void> => {
    try {
      const res: any = await dispatch(postCouponUser(values?.file));
      if (res?.payload?.status === 'success') {
        alertSuccess(api, '変更が完了しました。');
      } else {
        alertFail(api, '変更に失敗しました。');
      }
    } catch (error) {}
  };

  // HANDLE DUMMY REQUESTS
  const dummyRequest = async ({ onSuccess }: any): Promise<void> => {
    setTimeout((): void => {
      onSuccess('ok');
    }, 0);
  };

  function downloadBlob(content: any, filename: any, contentType: any): void {
    // Create a blob
    var blob: any = new Blob([content], { type: contentType });
    var url: string = URL.createObjectURL(blob);

    // Create a link to download it
    var pom: any = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }

  // HANDLE DOWNLOAD COUPON
  const handleDownloadCoupon = async (): Promise<void> => {
    try {
      const res: AxiosResponse<any, any> = await adminApi.downloadCoupon();
      downloadBlob(res, 'export.csv', 'text/csv;charset=utf-8;');
    } catch (error) {}
  };

  return (
    <div className="coupon-code-wrapper">
      {showPopup}
      <div className="coupon-code-content">
        <Button className="btn-coupon" onClick={handleDownloadCoupon}>
          ダウンロード
        </Button>
        <Form name="coupon" onFinish={onFinish} style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item name="file" valuePropName="file">
              <Upload name="file" maxCount={1} customRequest={dummyRequest} accept=".txt, .csv">
                <div>
                  <Button className="btn-coupon">Upload</Button>
                </div>
              </Upload>
            </Form.Item>
          </Space>
          <div className="btn-accept-coupon">
            <button className="btn-coupon" type="submit">
              保存
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CouponCode;
