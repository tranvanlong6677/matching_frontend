import SuccessAction from '../../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../../types/commonTypes';

const ChangeScheduleSuccess = () => {
  const props: SuccessActionPropsType = {
    title: 'キャスト変更依頼が完了しました。',
    textDescription: <>キャスト変更依頼が完了しました。<br/>変更確定後に、変更後の依頼確定メールを<br/>配信いたします。<br/>そのメールの配信をもって、<br/>変更完了とさせていただきます。</>,
    castEdit: true,
  };
  return (
    <>
      <SuccessAction {...props} />
    </>
  );
};

export default ChangeScheduleSuccess;
