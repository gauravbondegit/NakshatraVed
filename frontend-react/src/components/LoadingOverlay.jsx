import './LoadingOverlay.css';

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-body">
        <div className="mandala-loader">
          <div className="ml-ring ml-r1" />
          <div className="ml-ring ml-r2" />
          <div className="ml-ring ml-r3" />
          <div className="ml-center">{'\u0950'}</div>
        </div>
        <p className="load-title">Consulting the cosmos...</p>
        <p className="load-sub">Calculating planetary positions with Swiss Ephemeris</p>
      </div>
    </div>
  );
}
