import SuccessAction from '../../../../components/successAction';

const CustomerHearingSuccess = () => {
  const props = {
    title: '初回ヒアリング予約登録が完了しました。',
    textDescription: <>ヒアリング日時確定後、<br/>メールでご連絡いたします。</>,
    editCustomer: true,
  };
  return <SuccessAction {...props} />;
};

export default CustomerHearingSuccess;
