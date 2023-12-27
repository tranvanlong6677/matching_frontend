import SuccessAction from '../../../../../components/successAction';

const RegisterCustomerSuccess = () => {
  const title: string = '会員登録が完了しました。';
  const textDescription = (
    <>
      ご登録いただいたメールアドレスに
      <br />
      登録完了メールを送信いたしました。
    </>
  );

  return <SuccessAction header title={title} textDescription={textDescription} customer />;
};

export default RegisterCustomerSuccess;
