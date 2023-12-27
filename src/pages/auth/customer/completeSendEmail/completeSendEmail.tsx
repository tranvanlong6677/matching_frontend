import { NavigateFunction, useNavigate } from 'react-router-dom';
import image from '../../../../assets/images/index';
import config from '../../../../config';
const CompleteSendEmailCustomer = ({ changePassword = false }) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <>
      <div className="complete-container container-630">
        <h1 className="title">{changePassword ? 'パスワード変更依頼完了' : '仮登録完了'}</h1>
        {changePassword ? (
          <p className="description">
            ご登録いただいたメールアドレスに、
            <br />
            パスワード変更のご案内を送信しました。
            <br />
            メールに記載されているURLをクリックして
            <br />
            パスワードの変更を行ってください。
          </p>
        ) : (
          <p className="description">
            ご登録いただいたメールアドレスに、
            <br />
            本登録のご案内を送信しました。
            <br />
            メールに記載されている認証用URLをクリックして
            <br />
            アカウントの本登録を行ってください。
          </p>
        )}
        <div className="attention">
          <div className="attention-title">
            <img src={image.iconAttention} alt="Error" />

            <h1>メールが届かない場合</h1>
          </div>
          <div className="attention-content">
            <span>迷惑メールフォルダ等に振り分けられていないかご確認ください。</span>
            <span>メールが届かない場合、入力したメールアドレスが間違っている可能</span>
            <span>性がございます。再度、新規会員登録を行ってください。</span>
          </div>
        </div>

        <button
          className="btn btn-attention cr-allow"
          onClick={(): void => {
            navigate(config.routes.loginCustomer);
            localStorage.clear();
          }}
        >
          TOPページへ戻る
        </button>
      </div>
    </>
  );
};

export default CompleteSendEmailCustomer;
