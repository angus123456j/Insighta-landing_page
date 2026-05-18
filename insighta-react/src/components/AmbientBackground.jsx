const BG_IMAGE = '/refs/chrome-background.png';

export default function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-bg__image" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      <div className="ambient-bg__image ambient-bg__image--echo" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      <div className="ambient-bg__streaks" />
      <div className="ambient-bg__streaks ambient-bg__streaks--cool" />
      <div className="ambient-bg__sheen" />
    </div>
  );
}
