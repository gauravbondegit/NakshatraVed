const API_BASE = '/api';

export async function geocodePlace(place) {
  const resp = await fetch(`${API_BASE}/geocode?place=${encodeURIComponent(place)}`);
  if (!resp.ok) throw new Error('Location not found');
  return resp.json();
}

export async function geocodeSuggest(query) {
  const resp = await fetch(`${API_BASE}/geocode/suggest?q=${encodeURIComponent(query)}`);
  if (!resp.ok) return [];
  return resp.json();
}

export async function calculateKundali(payload) {
  let resp;
  try {
    resp = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}. Is the backend running on port 8000?`);
  }
  if (!resp.ok) {
    let detail = `Server returned ${resp.status}`;
    try {
      const body = await resp.json();
      detail = body.detail || detail;
    } catch { /* ignore parse error */ }
    throw new Error(detail);
  }
  return resp.json();
}
