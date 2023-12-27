import SuccessAction from '../../../../../components/successAction';

const CustomerDeleteBookingSuccess = () => {
  const props: any = {
    title: 'ご予約をキャンセルいたしました。',
    textDescription: (
      <>
        確定後に、キャンセル確定メールを配信いたします。
        <br />
        そのメールの配信をもって
        <br />
        キャンセル確定となります。
        <br />
        またのご利用お待ちしております。
      </>
    ),
    editCustomer: true,
    noImage: true,
    deleteBookingCustomer: true,
  };

  return <SuccessAction {...props} />;
};

export default CustomerDeleteBookingSuccess;
