import SuccessAction from '../../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../../types/commonTypes';

const EditCastSuccess = () => {
  const props: SuccessActionPropsType = {
    title: '会員情報が変更、更新されました。',
    textDescription:<>ご登録いただいたメールアドレス宛に<br/>更新完了メールを送信いたしました。</>,
    castEdit: true,
  };
  return <SuccessAction {...props} />;
};
export default EditCastSuccess;
