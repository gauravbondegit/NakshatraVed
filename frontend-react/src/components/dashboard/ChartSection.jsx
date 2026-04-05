import { useState, useMemo } from 'react';
import { CHART_LABELS } from '../../utils/constants';
import { buildD1ChartData } from '../../utils/helpers';
import NorthChart from './NorthChart';
import './ChartSection.css';

const DIV_CHARTS = ['D2', 'D3', 'D4', 'D9', 'D10'];

export default function ChartSection({ planets, ascendant, charts }) {
  const [activeDiv, setActiveDiv] = useState('D1');

  const d1Data = useMemo(
    () => buildD1ChartData(planets, ascendant.rashi_index),
    [planets, ascendant]
  );

  const divChartData = charts[activeDiv];

  return (
    <div className="chart-section">
      <div className="chart-grid">
        {/* Main Rashi Chart */}
        <div className="dash-card chart-card">
          <div className="chart-card-head">
            <h3>Rashi Chart <span className="chart-pill">D1</span></h3>
          </div>
          <NorthChart chartData={d1Data} planets={planets} />
        </div>

        {/* Divisional Charts */}
        <div className="dash-card chart-card">
          <div className="chart-card-head">
            <h3>Divisional Charts</h3>
            <div className="chart-tabs">
              {DIV_CHARTS.map(key => (
                <button
                  key={key}
                  className={`chart-tab ${activeDiv === key ? 'active' : ''}`}
                  onClick={() => setActiveDiv(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          {divChartData ? (
            <>
              <NorthChart chartData={divChartData} planets={activeDiv === 'D1' ? planets : null} />
              <p className="chart-label-text">{CHART_LABELS[activeDiv] || activeDiv}</p>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: 20 }}>Not available</p>
          )}
        </div>
      </div>
    </div>
  );
}
