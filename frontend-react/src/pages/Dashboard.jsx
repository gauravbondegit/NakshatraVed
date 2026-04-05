import { useState, useCallback } from 'react';
import { formatDegree, buildD1ChartData } from '../utils/helpers';
import { CHART_LABELS } from '../utils/constants';
import ChartSection from '../components/dashboard/ChartSection';
import PlanetSection from '../components/dashboard/PlanetSection';
import DashaSection from '../components/dashboard/DashaSection';
import YogaSection from '../components/dashboard/YogaSection';
import InsightSection from '../components/dashboard/InsightSection';
import AspectSection from '../components/dashboard/AspectSection';
import NorthChart from '../components/dashboard/NorthChart';
import './Dashboard.css';

const TABS = [
  { id: 'charts', label: 'Birth Chart' },
  { id: 'planets', label: 'Planets' },
  { id: 'dasha', label: 'Dasha' },
  { id: 'yogas', label: 'Yogas' },
  { id: 'insights', label: 'Insights' },
  { id: 'aspects', label: 'Aspects' },
];

const DIV_CHART_KEYS = ['D1', 'D2', 'D3', 'D4', 'D9', 'D10']; // D1 included in PDF for Rashi page

export default function Dashboard({ result, onNewChart }) {
  const [activeTab, setActiveTab] = useState('charts');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const { input, ayanamsa, ascendant, planets, charts } = result;
      const d1Data = buildD1ChartData(planets, ascendant.rashi_index);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;

      // Helper: render a chart SVG into a temporary container, capture, add to PDF
      const allCharts = DIV_CHART_KEYS.map(key => ({
        key,
        label: CHART_LABELS[key] || key,
        data: key === 'D1' ? d1Data : charts[key],
      })).filter(c => c.data);

      // Create a hidden container for rendering
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:600px;background:#FDF6EE;padding:40px;font-family:Inter,sans-serif;';
      document.body.appendChild(container);

      for (let i = 0; i < allCharts.length; i++) {
        const chart = allCharts[i];
        if (i > 0) pdf.addPage();

        // Build page content
        container.innerHTML = `
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#6B3A1F;margin:0 0 8px;">${input.name} - Kundali</h1>
            <p style="font-size:13px;color:#5C4033;margin:0;">
              ${input.year}-${String(input.month).padStart(2,'0')}-${String(input.day).padStart(2,'0')}
              &middot; ${String(input.hour).padStart(2,'0')}:${String(input.minute).padStart(2,'0')}
              &middot; ${input.place_name}
            </p>
            <p style="font-size:11px;color:#9C8579;margin:4px 0 0;">
              Lahiri Ayanamsa: ${ayanamsa.toFixed(4)}&deg; &middot; Lagna: ${ascendant.rashi} (${ascendant.rashi_english})
            </p>
          </div>
          <h2 style="text-align:center;font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#8B5E3C;margin:0 0 20px;">${chart.label}</h2>
          <div id="pdf-chart-render" style="display:flex;justify-content:center;"></div>
        `;

        // Render the SVG chart into the container
        const { createRoot } = await import('react-dom/client');
        const { createElement } = await import('react');
        const chartDiv = container.querySelector('#pdf-chart-render');
        const wrapper = document.createElement('div');
        wrapper.style.width = '420px';
        chartDiv.appendChild(wrapper);

        const root = createRoot(wrapper);
        root.render(createElement(NorthChart, {
          chartData: chart.data,
          planets: chart.key === 'D1' ? planets : null,
        }));

        // Wait for render
        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FDF6EE',
          logging: false,
        });

        root.unmount();

        const imgData = canvas.toDataURL('image/png');
        const imgW = canvas.width;
        const imgH = canvas.height;
        const ratio = Math.min(pageW / imgW, pageH / imgH);
        const drawW = imgW * ratio;
        const drawH = imgH * ratio;
        const offsetX = (pageW - drawW) / 2;
        const offsetY = Math.max(10, (pageH - drawH) / 3);

        pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);
      }

      document.body.removeChild(container);

      const name = input.name || 'kundali';
      pdf.save(`${name.replace(/\s+/g, '_')}_kundali_charts.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('PDF download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [result]);

  if (!result) return null;

  const { input, ayanamsa, ascendant, planets, charts, dashas, yogas, aspects } = result;
  const dateStr = `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`;
  const timeStr = `${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner page-container">
          <div className="dash-header-info">
            <h1 className="dash-person-name">{input.name}</h1>
            <p className="dash-details">
              {dateStr} &middot; {timeStr} &middot; {input.place_name}
              {input.latitude && ` \u00B7 ${input.latitude.toFixed(3)}\u00B0N, ${input.longitude.toFixed(3)}\u00B0E`}
            </p>
            <p className="dash-ayanamsa">
              Lahiri Ayanamsa: {ayanamsa.toFixed(4)}&deg; &middot; Lagna: {ascendant.rashi} ({ascendant.rashi_english}) {formatDegree(ascendant.degree_in_rashi)}
            </p>
          </div>
          <div className="dash-header-actions">
            <button className="btn-new-chart" onClick={onNewChart}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              New Chart
            </button>
            <button className="btn-download-pdf" onClick={handleDownloadPDF} disabled={downloading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="dash-tabs">
          <div className="dash-tabs-inner page-container">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="dash-content page-container">
        {activeTab === 'charts' && (
          <ChartSection planets={planets} ascendant={ascendant} charts={charts} />
        )}
        {activeTab === 'planets' && (
          <PlanetSection planets={planets} />
        )}
        {activeTab === 'dasha' && (
          <DashaSection dashas={dashas} />
        )}
        {activeTab === 'yogas' && (
          <YogaSection yogas={yogas} />
        )}
        {activeTab === 'insights' && (
          <InsightSection planets={planets} ascendant={ascendant} />
        )}
        {activeTab === 'aspects' && (
          <AspectSection aspects={aspects} />
        )}
      </main>
    </div>
  );
}
