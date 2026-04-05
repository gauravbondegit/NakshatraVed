import { useMemo } from 'react';
import { PLANET_ABBREV } from '../../utils/constants';

const S = 420;
const M = 18;
const L = M, R = S - M, W = R - L;
const CX = S / 2, CY = S / 2;

const T  = { x: CX, y: L };
const Rt = { x: R,  y: CY };
const B  = { x: CX, y: R };
const Lt = { x: L,  y: CY };
const TL = { x: L,  y: L };
const TR = { x: R,  y: L };
const BR = { x: R,  y: R };
const BL = { x: L,  y: R };
const IL = { x: L + W/4, y: L + W/4 };
const IR = { x: R - W/4, y: L + W/4 };
const IBR = { x: R - W/4, y: R - W/4 };
const IBL = { x: L + W/4, y: R - W/4 };

function centroid(a, b, c) {
  return { x: (a.x+b.x+c.x)/3, y: (a.y+b.y+c.y)/3 };
}

const houseVerts = {
  1: [T, IL, IR],   2: [T, TR, IR],   3: [TR, Rt, IR],
  4: [Rt, IR, IBR], 5: [Rt, BR, IBR], 6: [BR, B, IBR],
  7: [B, IBL, IBR], 8: [B, BL, IBL],  9: [BL, Lt, IBL],
  10:[Lt, IL, IBL], 11:[Lt, TL, IL],  12:[TL, T, IL],
};

const centroids = {};
for (let h = 1; h <= 12; h++) {
  const [a, b, c] = houseVerts[h];
  centroids[h] = centroid(a, b, c);
}

// Rashi numbers placed at the tip/corner of each house triangle, away from centroid
const rashiPos = {
  1:  { x: CX,          y: L + 14 },
  2:  { x: IR.x - 8,    y: L + 10 },
  3:  { x: R - 10,      y: IR.y - 8 },
  4:  { x: R - 14,      y: CY },
  5:  { x: R - 10,      y: IBR.y + 8 },
  6:  { x: IBR.x - 8,   y: R - 10 },
  7:  { x: CX,          y: R - 14 },
  8:  { x: IBL.x + 8,   y: R - 10 },
  9:  { x: L + 10,      y: IBL.y + 8 },
  10: { x: L + 14,      y: CY },
  11: { x: L + 10,      y: IL.y - 8 },
  12: { x: IL.x + 8,    y: L + 10 },
};

export default function NorthChart({ chartData, planets }) {
  const svgContent = useMemo(() => {
    if (!chartData) return null;

    const asc = chartData.ascendant_rashi;
    const lineClr = 'rgba(139, 94, 60, 0.45)';
    const bgFill = '#FDF6EE';
    const rashiClr = 'rgba(139, 94, 60, 0.7)';
    const pFillClr = '#2D1B0E';

    const housePlanets = {};
    for (let h = 1; h <= 12; h++) housePlanets[h] = [];
    for (const [pname, rIdx] of Object.entries(chartData.planet_rashis)) {
      const house = ((rIdx - asc + 12) % 12) + 1;
      housePlanets[house].push(PLANET_ABBREV[pname] || pname.slice(0, 2));
    }

    const elements = [];

    // Background
    elements.push(
      <rect key="bg" x="0" y="0" width={S} height={S} fill={bgFill} rx="12" stroke={lineClr} strokeWidth="1" />
    );

    // Grid lines
    elements.push(
      <rect key="border" x={L} y={L} width={W} height={W} fill="none" stroke={lineClr} strokeWidth="2" />,
      <line key="d1" x1={L} y1={L} x2={R} y2={R} stroke={lineClr} strokeWidth="1.4" />,
      <line key="d2" x1={R} y1={L} x2={L} y2={R} stroke={lineClr} strokeWidth="1.4" />,
      <polygon key="diamond"
        points={`${T.x},${T.y} ${Rt.x},${Rt.y} ${B.x},${B.y} ${Lt.x},${Lt.y}`}
        fill="none" stroke={lineClr} strokeWidth="1.4"
      />
    );

    // No center label — keep chart clean

    // Houses
    for (let house = 1; house <= 12; house++) {
      const rashiIdx = (asc + house - 1) % 12;
      const rashiNum = rashiIdx + 1;
      const rnp = rashiPos[house];
      const ct = centroids[house];

      // Rashi number at corner
      elements.push(
        <text key={`rashi-${house}`}
          x={rnp.x.toFixed(1)} y={rnp.y.toFixed(1)}
          textAnchor="middle" dominantBaseline="central"
          fontSize="9" fontFamily="'Inter',sans-serif"
          fill={rashiClr} fontWeight="600">
          {rashiNum}
        </text>
      );

      const plist = housePlanets[house];
      if (!plist.length) continue;

      // Planet abbreviations in house centroid
      if (plist.length <= 2) {
        elements.push(
          <text key={`pl-${house}`}
            x={ct.x.toFixed(1)} y={ct.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="central"
            fontSize={plist.length === 1 ? "12" : "11"}
            fontFamily="'Inter',sans-serif" fill={pFillClr} fontWeight="600">
            {plist.join('  ')}
          </text>
        );
      } else {
        const rows = [];
        for (let i = 0; i < plist.length; i += 2) rows.push(plist.slice(i, i + 2).join(' '));
        const lineH = 13;
        const totalH = rows.length * lineH;
        const startY = ct.y - totalH / 2 + lineH / 2;
        const fSize = plist.length > 4 ? 9 : 10;
        rows.forEach((row, r) => {
          elements.push(
            <text key={`pl-${house}-${r}`}
              x={ct.x.toFixed(1)} y={(startY + r * lineH).toFixed(1)}
              textAnchor="middle" dominantBaseline="central"
              fontSize={fSize} fontFamily="'Inter',sans-serif"
              fill={pFillClr} fontWeight="600">
              {row}
            </text>
          );
        });
      }
    }

    return elements;
  }, [chartData, planets]);

  if (!chartData) return null;

  return (
    <div className="north-chart-container">
      <svg viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: 420, width: '100%', height: 'auto' }}>
        {svgContent}
      </svg>
    </div>
  );
}
