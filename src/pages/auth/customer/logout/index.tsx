export default function Logout(): JSX.Element {
  return (
    <div className="block-logout">
      <h2>Log out</h2>
      <p>ログアウトしました</p>
      <div className="confirm-btn-container">
        <button className="btn btn-confirm btn-black">
          <span> マイページTOPへ</span>
        </button>
      </div>
    </div>
  );
}
