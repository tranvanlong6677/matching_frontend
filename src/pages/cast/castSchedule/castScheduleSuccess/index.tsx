import SuccessAction from '../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../types/commonTypes';

const CastScheduleSuccess = () => {
  const props: SuccessActionPropsType = {
    title: 'シフト情報の更新がされました。',
    textDescription: (
      <>
        シフト確定後に、シフト確定メールを登録された
        <br />
        メールアドレスへ配信いたします。
      </>
    ),
    castEdit: true,
  };
  return <SuccessAction {...props} />;
};

export default CastScheduleSuccess;
