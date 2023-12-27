import SuccessAction from '../../../../../components/successAction';

const RegisterSuccess = () => {
  const title: string = 'キャスト会員登録が完了しました。';
  const textDescription: any = <>ご登録いただいたメールアドレスに<br/>登録完了メールを送信いたしました。</>;
  return <SuccessAction header title={title} textDescription={textDescription} castRegister />;
};

export default RegisterSuccess;
