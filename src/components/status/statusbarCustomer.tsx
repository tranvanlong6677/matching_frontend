import images from '../../assets/images';

const StatusBarCustomer = ({ page1, page2, page3, customer = false }: any) => {
  return (
    <div className="status-bar-user">
      <div className={`status-element ${page1 ? 'active-custom' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconUser} alt="Error" />
          <span>個人情報入力</span>
        </div>
      </div>
      <div className={`status-element ${page2 ? 'active-custom' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconBank} alt="Error" />
          <span>決済情報入力</span>
        </div>
      </div>
      <div className={`status-element ${page3 ? 'active-custom' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconSuccess} alt="Error" />
          <span>完了</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBarCustomer;
