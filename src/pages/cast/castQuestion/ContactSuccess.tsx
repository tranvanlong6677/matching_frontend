import SuccessAction from '../../../components/successAction';
import { SuccessActionPropsType } from '../../../types/commonTypes';

const ContactSuccess = () => {
  const props: SuccessActionPropsType = {
    title: 'お問い合わせありがとうございました。',
    textDescription:<>後ほど、担当者よりご連絡をさせていただきます。<br/>今しばらくお待ちくださいますよう <br/> よろしくお願い申し上げます。<br/>なお、しばらくたっても当社より返信、返答がない場合は、<br/>お客様によりご入力いただいたメールアドレスに<br/>誤りがある場合がございます。<br/>その際は、お手数ですが再度送信いただけますと幸いです。</> ,
    castEdit: true,
    mail:true,
  };
  return (
    <div>
      <SuccessAction {...props} />
    </div>
  );
};

export default ContactSuccess;
