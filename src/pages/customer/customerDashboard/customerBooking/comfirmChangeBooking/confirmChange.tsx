import { Button, Checkbox, Form, Input } from 'antd';

const ConfirmChangeBooking = () => {
  const { TextArea }: any = Input;
  return (
    <div className="confirm-booking-container">
      <h1 className="title">予約内容変更確認画面</h1>
      <div className="info-content">
        <div className="info-content-element">
          <span className="field">サービス</span>
          <span className="value">掃除代行サービス</span>
        </div>
        <div className="info-content-element">
          <span className="field">予約日時</span>
          <span className="value">2023年１月30日(水)9:00〜12:00</span>
        </div>
        <div className="info-content-element">
          <span className="field">依頼時間</span>
          <span className="value">3時間</span>
        </div>
        <div className="info-content-element">
          <span className="field">キャスト指名料</span>
          <span className="value">¥0,000</span>
        </div>
        <div className="info-content-element">
          <span className="field">概算料金</span>
          <span className="value">¥00,000</span>
        </div>
        <div className="info-content-element red">
          <span className="field">キャンセル料金</span>
          <span className="value">¥00,000</span>
        </div>
      </div>
      <div className="attention">
        <p>
          ※キャンセル可能期日を過ぎたキャンセルの場合には、キャンセル確定後
          キャンセル料金を、ご登録いただいたクレジットカードにご請求いたします。
        </p>
      </div>

      <div className="reason">
        <div className="title">
          <span>キャンセル理由（複数回答可）</span>
          <span className="red">*必須項目</span>
        </div>
        <Form name="reason">
          <Form.Item name="reason-1" valuePropName="checked">
            <Checkbox>サービスを利用する必要がなくなった</Checkbox>
          </Form.Item>
          <Form.Item name="reason-2" valuePropName="checked">
            <Checkbox>依頼した日程の都合が合わなくなった</Checkbox>
          </Form.Item>
          <Form.Item name="reason-3" valuePropName="checked">
            <Checkbox>別のサービスにお願いすることにした</Checkbox>
          </Form.Item>
          <Form.Item name="reason-4" valuePropName="checked">
            <Checkbox>別のサービスにお願いすることにした</Checkbox>
          </Form.Item>
          <Form.Item name="reason-5" valuePropName="checked">
            <Checkbox>その他 （理由を記載ください）</Checkbox>
          </Form.Item>
          <Form.Item name="reason-5" valuePropName="checked">
            <TextArea className="textarea-global" />
          </Form.Item>
        </Form>
      </div>
      <div className="button-block">
        <Button type="primary" htmlType="submit" className="btn">
          キャンセルせずに戻る
        </Button>
        <Button type="primary" htmlType="submit" className="btn">
          確定
        </Button>
      </div>
    </div>
  );
};

export default ConfirmChangeBooking;
