import { PLANET_NAMES, PLANET_SYMBOLS, PLANET_COLORS, DIGNITY_STYLES } from '../../utils/constants';
import { formatDegree } from '../../utils/helpers';
import './PlanetSection.css';

export default function PlanetSection({ planets }) {
  return (
    <div className="planet-section">
      {/* Planet Cards */}
      <div className="planet-cards-grid">
        {planets.map(p => {
          const color = p.is_retrograde ? '#FF6B6B' : (PLANET_COLORS[p.name] || '#FFD700');
          const symbol = PLANET_SYMBOLS[p.name] || '\u2605';
          const biName = PLANET_NAMES[p.name] || p.name;
          const dignityStyle = DIGNITY_STYLES[p.dignity];

          return (
            <div className="planet-card" key={p.name} style={{ '--pc': color }}>
              <span className="pc-symbol">{symbol}</span>
              <div className="pc-name">{biName}</div>
              <div className="pc-rashi">{p.rashi} ({p.rashi_english})</div>
              <div className="pc-details">
                {formatDegree(p.degree_in_rashi)}<br />
                {p.nakshatra} Pada {p.nakshatra_pada}<br />
                House {p.house}
              </div>
              {p.dignity && (
                <span className="pc-dignity" style={dignityStyle ? {
                  background: dignityStyle.bg,
                  border: `1px solid ${dignityStyle.border}`,
                  color: dignityStyle.color,
                } : undefined}>
                  {p.dignity}
                </span>
              )}
              {p.is_retrograde && <span className="pc-retro">{'\u21BA'} Retrograde</span>}
            </div>
          );
        })}
      </div>

      {/* Planet Table */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <h3>Detailed Planetary Positions</h3>
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Graha</th><th>Rashi</th><th>Degree</th>
                <th>Nakshatra</th><th>Pada</th><th>House</th><th>Dignity</th><th>R</th>
              </tr>
            </thead>
            <tbody>
              {planets.map(p => (
                <tr key={p.name}>
                  <td><strong>{PLANET_NAMES[p.name] || p.name}</strong></td>
                  <td>{p.rashi} ({p.rashi_english})</td>
                  <td>{formatDegree(p.degree_in_rashi)}</td>
                  <td>{p.nakshatra}</td>
                  <td>{p.nakshatra_pada}</td>
                  <td>{p.house}</td>
                  <td style={DIGNITY_STYLES[p.dignity] ? { color: DIGNITY_STYLES[p.dignity].color } : undefined}>
                    {p.dignity || '\u2014'}
                  </td>
                  <td>{p.is_retrograde ? <span className="retro-badge">R</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
