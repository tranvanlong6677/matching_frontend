import { Link } from 'react-router-dom';
import SuccessAction from '../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../types/commonTypes';

const CastDeleteAccountSuccess = () => {
  const props: SuccessActionPropsType = {
    title: '退会の手続きが完了しました。',
    textDescription: (
      <>
        こちらでキャスト登録の退会手続きが完了しました。<br />
        退会完了確認メールをお送りいたしますので、<br />
         必ずご確認をお願いいたします。<br />
        また、退会確認メールが届かない場合には、<br/>
        大変お手数ですが、<br/>
        サービス窓口 <Link to='#' className='link-mail'>xxxxx@xxxxx.xx</Link>まで <br/>
        ご連絡をお願いいたします。
      </>
    ),
    deleteCast: true,
    noImage:true,
    deleteAccount:true,
  };
  return (
    <>
      <SuccessAction {...props} />
    </>
  );
};
export default CastDeleteAccountSuccess;
