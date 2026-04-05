import './ZodiacWheel.css';

const SIGNS = [
  { symbol: '\u2648', name: 'Aries' },
  { symbol: '\u2649', name: 'Taurus' },
  { symbol: '\u264A', name: 'Gemini' },
  { symbol: '\u264B', name: 'Cancer' },
  { symbol: '\u264C', name: 'Leo' },
  { symbol: '\u264D', name: 'Virgo' },
  { symbol: '\u264E', name: 'Libra' },
  { symbol: '\u264F', name: 'Scorpio' },
  { symbol: '\u2650', name: 'Sagittarius' },
  { symbol: '\u2651', name: 'Capricorn' },
  { symbol: '\u2652', name: 'Aquarius' },
  { symbol: '\u2653', name: 'Pisces' },
];

const INNER_SYMBOLS = ['\u2609', '\u263D', '\u2642', '\u263F', '\u2643', '\u2640', '\u2644'];

export default function ZodiacWheel() {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="zodiac-wheel-wrapper">
      <div className="zodiac-glow" />
      <svg
        className="zodiac-wheel"
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="zw-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(200,135,62,0.06)" />
            <stop offset="100%" stopColor="rgba(200,135,62,0)" />
          </radialGradient>
          <filter id="zw-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(200,135,62,0.3)" />
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx={cx} cy={cy} r={220} fill="url(#zw-bg)" />

        {/* Outer decorative ring */}
        <circle cx={cx} cy={cy} r={218} fill="none" stroke="rgba(200,135,62,0.12)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={210} fill="none" stroke="rgba(200,135,62,0.08)" strokeWidth="1" strokeDasharray="4 6" />

        {/* Zodiac signs ring */}
        <circle cx={cx} cy={cy} r={185} fill="none" stroke="rgba(200,135,62,0.2)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={150} fill="none" stroke="rgba(200,135,62,0.2)" strokeWidth="1.5" />

        {/* Division lines */}
        {SIGNS.map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = cx + 150 * Math.cos(angle);
          const y1 = cy + 150 * Math.sin(angle);
          const x2 = cx + 185 * Math.cos(angle);
          const y2 = cy + 185 * Math.sin(angle);
          return (
            <line
              key={`div-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(200,135,62,0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Zodiac symbols */}
        {SIGNS.map((sign, i) => {
          const angle = ((i * 30) + 15 - 90) * (Math.PI / 180);
          const r = 167;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <text
              key={`sign-${i}`}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="18"
              fill="#C8873E"
              fontWeight="500"
              opacity="0.8"
            >
              {sign.symbol}
            </text>
          );
        })}

        {/* Inner rings */}
        <circle cx={cx} cy={cy} r={125} fill="none" stroke="rgba(200,135,62,0.12)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r={100} fill="none" stroke="rgba(200,135,62,0.15)" strokeWidth="1" />

        {/* Inner planet symbols */}
        {INNER_SYMBOLS.map((sym, i) => {
          const angle = ((i * 360 / INNER_SYMBOLS.length) - 90) * (Math.PI / 180);
          const r = 112;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <text
              key={`planet-${i}`}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fill="#8B5E3C"
              opacity="0.5"
            >
              {sym}
            </text>
          );
        })}

        {/* Inner decorative ring */}
        <circle cx={cx} cy={cy} r={75} fill="none" stroke="rgba(200,135,62,0.1)" strokeWidth="1" strokeDasharray="3 5" />

        {/* Center sun */}
        <circle cx={cx} cy={cy} r={50} fill="rgba(200,135,62,0.04)" stroke="rgba(200,135,62,0.2)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={30} fill="rgba(200,135,62,0.06)" stroke="rgba(200,135,62,0.15)" strokeWidth="1" />

        {/* Sun rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = cx + 32 * Math.cos(angle);
          const y1 = cy + 32 * Math.sin(angle);
          const x2 = cx + 48 * Math.cos(angle);
          const y2 = cy + 48 * Math.sin(angle);
          return (
            <line
              key={`ray-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(200,135,62,0.2)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center symbol */}
        <text
          x={cx} y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="28"
          fill="#C8873E"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          filter="url(#zw-glow)"
        >
          {'\u2609'}
        </text>

        {/* Outer decorative dots */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10) * (Math.PI / 180);
          const r = 200;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <circle
              key={`dot-${i}`}
              cx={x} cy={y}
              r={i % 3 === 0 ? 2.5 : 1.2}
              fill={i % 3 === 0 ? 'rgba(200,135,62,0.35)' : 'rgba(200,135,62,0.15)'}
            />
          );
        })}
      </svg>
    </div>
  );
}
