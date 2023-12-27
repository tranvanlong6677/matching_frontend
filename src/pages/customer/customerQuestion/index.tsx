import { Collapse } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

import image from '../../../assets/images/index';

const { Panel }: any = Collapse;
const CustomerAskedQuestions = () => {
  return (
    <div className="block-question user-block-questions container-680">
      <div className="content">
        <div className="menu-content">
          <div className="head-title">
            <div className="icon">
              <img src={image.iconQuestion} alt="" />
            </div>
            <h2 className="item-title-question">よくあるご質問</h2>
          </div>
          <div className="question-item">
            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span> シフト変更はできますか？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span> IDを忘れた場合、どうすればいいでしょうか？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span>パスワードは変更できますか？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span>お支払いについて詳しく知りたいのですが？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span>XXXXXXXはできますか？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div className="question-element">
              <Collapse
                expandIcon={({ isActive }: any): any => (!isActive ? <PlusOutlined /> : <MinusOutlined />)}
                expandIconPosition="end"
              >
                <Panel
                  key="1"
                  showArrow={true}
                  header={
                    <p>
                      <span>Q.</span>XXXXXXXはできますか？
                    </p>
                  }
                >
                  <div className="answer-container">
                    <span>A.</span>
                    <p>
                      可能です。マイページ「シフト登録」よりシフトの変更を
                      行なってください。変更後リマインドメールが届きます ので、そちらをもって手続きが完了します。
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerAskedQuestions;
