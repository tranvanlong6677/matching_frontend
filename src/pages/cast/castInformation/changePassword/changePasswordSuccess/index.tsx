import SuccessAction from '../../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../../types/commonTypes';
const ChangePasswordSuccess = () => {
  const props: SuccessActionPropsType = {
    title: 'パスワードが更新されました。',
    textDescription: (
      <>
        ご登録頂いたメールアドレス宛に
        <br />
        更新完了メールをお送りいたします。
      </>
    ),
    castRegister: true,
  };
  return (
    <div>
      <SuccessAction {...props} />
    </div>
  );
};

export default ChangePasswordSuccess;
