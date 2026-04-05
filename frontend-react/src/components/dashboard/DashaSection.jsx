import { useState } from 'react';
import { PLANET_NAMES, DASHA_COLORS } from '../../utils/constants';
import './DashaSection.css';

export default function DashaSection({ dashas }) {
  const today = new Date().toISOString().slice(0, 10);

  if (!dashas || !dashas.length) {
    return <div className="dash-card"><p style={{ color: 'var(--dash-text-muted)' }}>No dasha data available.</p></div>;
  }

  const allStart = new Date(dashas[0].start_date);
  const allEnd = new Date(dashas[dashas.length - 1].end_date);
  const totalMs = allEnd - allStart;

  return (
    <div className="dasha-section">
      <div className="dash-card">
        <h3>Vimshottari Dasha - Planetary Periods</h3>
        <p className="section-note">Based on Moon's nakshatra at birth - 120-year Maha Dasha cycle</p>

        {/* Timeline */}
        <div className="dasha-timeline-scroll">
          <div className="dasha-timeline">
            {dashas.map((md, i) => {
              const s = new Date(md.start_date);
              const e = new Date(md.end_date);
              const widthPct = ((e - s) / totalMs * 100).toFixed(2);
              const isCurr = md.start_date <= today && md.end_date >= today;
              const clr = DASHA_COLORS[i % DASHA_COLORS.length];

              return (
                <div
                  key={i}
                  className={`dasha-seg ${isCurr ? 'current' : ''}`}
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(180deg, ${clr}55 0%, ${clr}33 100%)`,
                    color: clr,
                  }}
                  title={`${md.lord} Mahadasha: ${md.start_date} - ${md.end_date}`}
                >
                  <span className="ds-lord">{md.lord}</span>
                  <span className="ds-dates">{md.start_date.slice(0, 4)}-{md.end_date.slice(0, 4)}</span>
                </div>
              );
            })}
            {today >= dashas[0].start_date && today <= dashas[dashas.length - 1].end_date && (
              <div
                className="dasha-now-line"
                style={{ left: `${((new Date(today) - allStart) / totalMs * 100).toFixed(2)}%` }}
              />
            )}
          </div>
        </div>

        {/* Tree */}
        <div className="dasha-tree">
          {dashas.map((md, i) => {
            const isCurr = md.start_date <= today && md.end_date >= today;
            return (
              <DashaMaha key={i} md={md} isCurr={isCurr} today={today} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashaMaha({ md, isCurr, today }) {
  const [open, setOpen] = useState(isCurr);

  return (
    <div className="dasha-maha">
      <div
        className={`dasha-maha-head ${isCurr ? 'is-current' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <div>
          <span className="md-lord">{PLANET_NAMES[md.lord] || md.lord} Mahadasha</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="md-dates">{md.start_date} - {md.end_date}</span>
          <span className={`md-arrow ${open ? 'open' : ''}`}>{'\u25B6'}</span>
        </div>
      </div>
      {open && md.sub_periods && (
        <div className="dasha-maha-body open">
          {md.sub_periods.map((ad, j) => {
            const adCurr = ad.start_date <= today && ad.end_date >= today;
            return (
              <div key={j} className={`dasha-antar ${adCurr ? 'is-current' : ''}`}>
                <span>{ad.lord} Antardasha</span>
                <span className="ad-dates">{ad.start_date} - {ad.end_date}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
