import SuccessAction from '../../../../../components/successAction';

const CustomerRebookComplete = () => {
  const props: any = {
    title: 'ご予約変更依頼完了',
    textDescription: (
      <>
        ご予約変更依頼が完了しました。
        <br />
        変更確定後、依頼確定メールを配信いたします。
        <br />
        そのメールの配信をもって、
        <br />
        変更完了とさせていただきます。
      </>
    ),
    isReBooking: true,
  };
  return <SuccessAction {...props} />;
};

export default CustomerRebookComplete;
