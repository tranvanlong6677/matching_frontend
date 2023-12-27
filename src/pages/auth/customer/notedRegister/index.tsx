import { NavigateFunction, useNavigate } from 'react-router-dom';
import config from '../../../../config';

export default function NotedRegister(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="block-note-register container-680">
      <div className="header-note-item">
        <h2>会員登録をされる前のご注意</h2>
      </div>
      <div className="description-item">
        <p>
          個人情報の入力後に「本人認証登録」を行います。
          <br />
          写真付き本人確認書類（たとえば免許証など）を
          <br />
          ご用意いただき、記載されている情報を入力ください。
          <br />
          「本人認証登録」の際、登録した情報と異なる場合、
          <br />
          認証エラーになる恐れがあります。
        </p>
      </div>
      <div className="block-btn-node-register">
        <button
          className="btn btn-node-register cr-allow"
          onClick={(): void => {
            navigate(config.routes.signupCustomer);
          }}
        >
          会員登録へ進む
        </button>
      </div>
    </div>
  );
}
