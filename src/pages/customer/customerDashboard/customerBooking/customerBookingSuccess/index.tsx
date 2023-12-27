import SuccessAction from '../../../../../components/successAction';

const CustomerBookingSuccess = () => {
  const props: any = {
    title: 'ご依頼が完了しました。',
    textDescription: (
      <>
        ご依頼確定後に、ご依頼確定メールを登録された
        <br />
        メールアドレスへ配信いたします。
        <br />
        予約確定は遅くとも、ご依頼日の1週間前に確定をします。
        <br />
        （予約が確定しない場合には、キャンセルされます。）
        <br />
        そのメールの配信をもって、ご依頼完了となります。
      </>
    ),
    bookingSuccess: true,
  };
  return <SuccessAction {...props} />;
};

export default CustomerBookingSuccess;
