import './YogaSection.css';

export default function YogaSection({ yogas }) {
  return (
    <div className="yoga-section">
      <div className="dash-card">
        <h3>Yogas - Planetary Combinations</h3>
        <p className="section-note">Special alignments and their effects on your life</p>

        {!yogas || yogas.length === 0 ? (
          <p className="yoga-none">No major yogas detected in this chart.</p>
        ) : (
          <div className="yoga-grid">
            {yogas.map((y, i) => (
              <div key={i} className={`yoga-card ${y.is_benefic ? 'benefic' : 'malefic'}`}>
                <div className="yoga-name">{y.name}</div>
                <div className="yoga-desc">{y.description}</div>
                <div className="yoga-planets">Planets: {y.involved_planets.join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
