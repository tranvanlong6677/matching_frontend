import { NavigateFunction, useNavigate } from 'react-router-dom';
import image from '../../../../../assets/images/index';
import config from '../../../../../config';

const QuestionSuccess = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="complete-check-container question-success-wrapper container-680">
      <img src={image.iconDove} alt="" />
      <h1>アンケートのご協力ありがとうございました</h1>
      <span className="text-description" style={{ whiteSpace: 'nowrap' }}>
        いただいた内容はサービス向上に役立ててまいります。
        <br />
        ありがとうございました。
      </span>
      <div className="block-btn confirm-btn-container">
        <button
          className=" btn btn-confirm btn-black"
          onClick={(): void => {
            navigate(config.routes.customerDashboard);
          }}
        >
          <img src={image.iconUser} alt="" />
          マイページTOPへ
        </button>
      </div>
    </div>
  );
};

export default QuestionSuccess;
