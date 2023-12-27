import SuccessAction from '../../../../../components/successAction';

const EditCustomerSuccess = () => {
  const props: any = {
    title: '会員情報が変更、更新されました。',
    textDescription: (
      <>
        ご登録いただいたメールアドレス宛に
        <br />
        更新完了メールを送信いたしました。
      </>
    ),
    editCustomer: true,
  };

  return <SuccessAction {...props} />;
};

export default EditCustomerSuccess;
