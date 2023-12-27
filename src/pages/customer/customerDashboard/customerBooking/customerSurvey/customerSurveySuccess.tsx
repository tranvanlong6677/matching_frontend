import SuccessAction from '../../../../../components/successAction';

const CustomerSurveySuccess = () => {
  const props: any = {
    textDescription: (
      <>
        本日はご利用ありがとうございました。
        <br />
        お客様の生活が、より豊かになる様に
        <br />
        スタッフ一同努めてまいります。
        <br />
        引き続きよろしくお願いいたします。
      </>
    ),
    editCustomer: true,
    surveySuccess: true,
  };

  return <SuccessAction {...props} />;
};

export default CustomerSurveySuccess;
