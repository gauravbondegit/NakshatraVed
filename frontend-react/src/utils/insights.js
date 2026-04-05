import { PLANET_NAMES } from './constants';

function ph(planets, house) { return planets.filter(p => p.house === house); }
function pn(planets, name) { return planets.find(p => p.name === name); }

export function careerInsight(planets) {
  const h10 = ph(planets, 10);
  const sun = pn(planets, 'Sun');
  const sat = pn(planets, 'Saturn');
  let text = 'Your 10th house governs career and public status. ';
  let rating = 3;
  if (h10.length > 0) {
    text += `${h10.map(p => PLANET_NAMES[p.name] || p.name).join(' & ')} in the 10th house brings prominence and professional recognition. `;
    rating = Math.min(5, rating + h10.length);
  }
  if (sun?.dignity === 'Exalted') { text += 'Exalted Sun grants natural leadership and authority. '; rating = Math.min(5, rating + 1); }
  if (sat?.dignity === 'Own Sign') { text += 'Saturn in own sign supports disciplined, long-term career success. '; rating = Math.min(5, rating + 1); }
  if (sun?.dignity === 'Debilitated') { text += 'Libra Sun requires extra effort to establish authority. '; rating = Math.max(1, rating - 1); }
  text += 'Consistent effort and strategic planning will yield the best professional outcomes.';
  return { text, rating };
}

export function wealthInsight(planets) {
  const h2 = ph(planets, 2);
  const h11 = ph(planets, 11);
  const jup = pn(planets, 'Jupiter');
  let text = 'The 2nd house rules accumulated wealth and the 11th governs gains and income. ';
  let rating = 3;
  if (jup?.dignity === 'Exalted') { text += 'Exalted Jupiter bestows excellent fortune and financial wisdom. '; rating = Math.min(5, rating + 2); }
  if (jup?.dignity === 'Debilitated') { text += 'Jupiter in Capricorn demands careful financial planning. '; rating = Math.max(1, rating - 1); }
  if (h11.length > 0) { text += `${h11.map(p => p.name).join(' & ')} in the 11th house supports multiple income streams. `; rating = Math.min(5, rating + 1); }
  if (h2.length > 0) { text += 'Planets in the 2nd house strengthen material accumulation. '; }
  text += 'Investments aligned with your 11th house lord will bring the greatest returns.';
  return { text, rating };
}

export function loveInsight(planets) {
  const h7 = ph(planets, 7);
  const ven = pn(planets, 'Venus');
  const jup = pn(planets, 'Jupiter');
  let text = 'The 7th house and Venus govern partnerships, marriage, and romantic relationships. ';
  let rating = 3;
  if (ven?.dignity === 'Exalted') { text += 'Exalted Venus in Pisces blesses with deep love and harmonious partnerships. '; rating = Math.min(5, rating + 2); }
  if (ven?.dignity === 'Debilitated') { text += 'Venus in Virgo may bring high expectations in relationships. '; rating = Math.max(1, rating - 1); }
  if (h7.length > 0) { text += `${h7.map(p => PLANET_NAMES[p.name] || p.name).join(' & ')} in the 7th strengthens the marriage house. `; rating = Math.min(5, rating + 1); }
  if (jup?.house === 7) { text += 'Jupiter in the 7th is highly auspicious for a wise and noble partner. '; rating = Math.min(5, rating + 1); }
  text += 'Communication and mutual respect are keys to lasting relationship harmony.';
  return { text, rating };
}

export function healthInsight(planets) {
  const h6 = ph(planets, 6);
  const h1 = ph(planets, 1);
  const sun = pn(planets, 'Sun');
  const moon = pn(planets, 'Moon');
  let text = 'The 1st house represents vitality and overall constitution; the 6th governs diseases. ';
  let rating = 3;
  if (h1.length > 0) { text += `${h1.map(p => p.name).join(' & ')} in the Lagna influences physical appearance and vitality. `; }
  if (sun?.dignity === 'Exalted') { text += 'Exalted Sun gives robust constitution and strong immunity. '; rating = Math.min(5, rating + 1); }
  if (moon?.dignity === 'Exalted') { text += 'Exalted Moon supports strong mental health and emotional balance. '; rating = Math.min(5, rating + 1); }
  if (h6.length > 1) { text += 'Multiple planets in the 6th house indicate need for attention to health routines. '; rating = Math.max(2, rating - 1); }
  text += 'Regular yoga, meditation, and Vedic lifestyle practices will greatly enhance your wellbeing.';
  return { text, rating };
}

export const INSIGHT_CONFIG = [
  { key: 'career', title: 'Career & Status', color: '#4FC3F7', generate: careerInsight },
  { key: 'wealth', title: 'Wealth & Finance', color: '#FFD700', generate: wealthInsight },
  { key: 'love', title: 'Love & Marriage', color: '#F48FB1', generate: loveInsight },
  { key: 'health', title: 'Health & Vitality', color: '#69F0AE', generate: healthInsight },
];
