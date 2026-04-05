export function formatDegree(deg) {
  const d = Math.floor(deg);
  const mf = (deg - d) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${d}\u00B0${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

export function buildD1ChartData(planets, ascendantRashiIndex) {
  const pr = {};
  planets.forEach(p => { pr[p.name] = p.rashi_index; });
  return { chart_type: 'D1 (Rashi)', planet_rashis: pr, ascendant_rashi: ascendantRashiIndex };
}
