import images from '../../assets/images';

const StatusBar = ({ page1, page2, page3 }: any) => {
  return (
    <div className="status-bar">
      <div className={`status-element ${page1 ? 'active' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconUser} alt="Error" />
          <span>個人情報入力</span>
        </div>
      </div>
      <div className={`status-element ${page2 ? 'active' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconBank} alt="Error" />
          <span>振込先情報入力</span>
        </div>
      </div>
      <div className={`status-element ${page3 ? 'active' : ''}`}>
        <div className="status-element-content">
          <img src={images.iconSuccess} alt="Error" />
          <span>完了</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
