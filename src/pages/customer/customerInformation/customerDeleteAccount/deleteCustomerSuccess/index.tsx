import SuccessAction from '../../../../../components/successAction';

const DeleteCustomerSuccess = () => {
  const props: any = {
    title: '退会の手続きが完了しました。',
    textDescription: (
      <>
        これまで、ご利用頂きありがとうございました。
        <br />
        退会完了確認メールをお送りいたしますので、
        <br />
        必ずご確認をお願いいたします。
        <br />
        また、退会確認メールが届かない場合には、
        <br />
        大変お手数ですが、
        <br />
        サービス窓口<span className="mail-delete-success">customer-info@epais.co.jp</span>まで
        <br />
        ご連絡をお願いいたします。
        <br />
        またのご利用をお待ちしております。
      </>
    ),
    customer: true,
    noImage: true,
    deleteCast: true,
    deleteAccount: true,
  };
  return <SuccessAction {...props} />;
};

export default DeleteCustomerSuccess;
