import SuccessAction from '../../../../../components/successAction';

const CustomerChangePasswordSuccess = () => {
  const props: any = {
    title: 'パスワードが更新されました。',
    textDescription: (
      <>
        ご登録いただいたメールアドレス宛に
        <br />
        更新完了メールを送信いたしました。
      </>
    ),
    customer: true,
  };
  return (
    <div>
      <SuccessAction {...props} />
    </div>
  );
};

export default CustomerChangePasswordSuccess;
