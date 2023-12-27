import SuccessAction from '../../../../components/successAction';
import { SuccessActionPropsType } from '../../../../types/commonTypes';

const CastReportSuccess = () => {
  const props: SuccessActionPropsType = {
    title: 'サービス完了を報告しました。',
    textDescription: <>お疲れ様でした！<br/>引き続きよろしくお願い致します。</>,
    castEdit: true,
  };
  return (
    <div>
      <SuccessAction {...props} />
    </div>
  );
};

export default CastReportSuccess;
