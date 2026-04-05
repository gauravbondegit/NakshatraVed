import { INSIGHT_CONFIG } from '../../utils/insights';
import './InsightSection.css';

function Stars({ count }) {
  return (
    <div className="insight-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= count ? 'on' : 'off'}`}>{'\u2605'}</span>
      ))}
    </div>
  );
}

export default function InsightSection({ planets, ascendant }) {
  return (
    <div className="insight-section">
      <h2 className="insights-heading">Your Cosmic Insights</h2>
      <div className="insights-grid">
        {INSIGHT_CONFIG.map(cfg => {
          const { text, rating } = cfg.generate(planets, ascendant);
          return (
            <div key={cfg.key} className="insight-card" style={{ '--ic': cfg.color }}>
              <div className="insight-title">{cfg.title}</div>
              <div className="insight-text">{text}</div>
              <Stars count={rating} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
