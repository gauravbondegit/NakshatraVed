import './MoonPhases.css';

const PHASES = [
  { name: 'New Moon', fill: 0 },
  { name: 'Waxing Crescent', fill: 0.25 },
  { name: 'First Quarter', fill: 0.5 },
  { name: 'Waxing Gibbous', fill: 0.75 },
  { name: 'Full Moon', fill: 1 },
  { name: 'Waning Gibbous', fill: 0.75, waning: true },
  { name: 'Last Quarter', fill: 0.5, waning: true },
  { name: 'Waning Crescent', fill: 0.25, waning: true },
];

function MoonIcon({ fill, waning, size = 40 }) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  if (fill === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#2D1B0E" stroke="rgba(200,135,62,0.3)" strokeWidth="1" />
      </svg>
    );
  }

  if (fill === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#C8873E" opacity="0.9" />
      </svg>
    );
  }

  const litSweep = fill * 2 - 1;
  const litX = cx + litSweep * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#2D1B0E" stroke="rgba(200,135,62,0.3)" strokeWidth="1" />
      <clipPath id={`moon-clip-${fill}-${waning ? 'w' : 'x'}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 ${waning ? 0 : 1} ${cx} ${cy + r} A ${Math.abs(litSweep) * r} ${r} 0 0 ${litSweep >= 0 ? (waning ? 0 : 1) : (waning ? 1 : 0)} ${cx} ${cy - r}`}
        fill="#C8873E"
        opacity="0.85"
        clipPath={`url(#moon-clip-${fill}-${waning ? 'w' : 'x'})`}
      />
    </svg>
  );
}

export default function MoonPhases() {
  return (
    <div className="moon-phases">
      <div className="moon-phases-track">
        {PHASES.map((phase, i) => (
          <div className="moon-phase-item" key={i}>
            <MoonIcon fill={phase.fill} waning={phase.waning} size={40} />
            <span className="moon-phase-name">{phase.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
