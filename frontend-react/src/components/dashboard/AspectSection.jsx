import { PLANET_NAMES } from '../../utils/constants';

export default function AspectSection({ aspects }) {
  return (
    <div className="aspect-section">
      <div className="dash-card">
        <h3>Graha Drishti - Planetary Aspects</h3>
        <p className="section-note">Special aspects as per Vedic (Parashari) rules</p>
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Aspecting Planet</th>
                <th>Aspected Planet</th>
                <th>Aspect Type</th>
              </tr>
            </thead>
            <tbody>
              {aspects && aspects.map((a, i) => (
                <tr key={i}>
                  <td>{PLANET_NAMES[a.aspecting_planet] || a.aspecting_planet}</td>
                  <td>{PLANET_NAMES[a.aspected_planet] || a.aspected_planet}</td>
                  <td>{a.aspect_type}</td>
                </tr>
              ))}
              {(!aspects || aspects.length === 0) && (
                <tr><td colSpan="3" style={{ color: 'var(--dash-text-muted)', textAlign: 'center' }}>No aspects data available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
