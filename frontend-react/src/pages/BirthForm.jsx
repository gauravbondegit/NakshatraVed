import { useState, useRef, useCallback, useEffect } from 'react';
import { geocodePlace, geocodeSuggest } from '../utils/api';
import './BirthForm.css';

export default function BirthForm({ onSubmit, serverError }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    hour: '06',
    minute: '00',
    ampm: 'AM',
    place: '',
    gender: 'male',
  });
  const [location, setLocation] = useState({ lat: null, lon: null, tz: null, display: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeStatus, setPlaceStatus] = useState({ type: '', text: '' });
  const [error, setError] = useState('');
  const geoTimer = useRef(null);
  const placeRef = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePlaceChange = useCallback((value) => {
    updateField('place', value);
    setLocation({ lat: null, lon: null, tz: null, display: '' });

    if (value.trim().length < 2) {
      setPlaceStatus({ type: '', text: '' });
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(geoTimer.current);
    geoTimer.current = setTimeout(async () => {
      try {
        const results = await geocodeSuggest(value.trim());
        if (results.length > 0) {
          setSuggestions(results);
          setShowSuggestions(true);
          setPlaceStatus({ type: '', text: '' });
        } else {
          try {
            const data = await geocodePlace(value.trim());
            setLocation({ lat: data.latitude, lon: data.longitude, tz: data.timezone, display: data.display_name });
          } catch {
            // No coordinates found — that's fine, backend will resolve it
          }
          setPlaceStatus({ type: '', text: '' });
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setPlaceStatus({ type: '', text: '' });
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
  }, [updateField]);

  const selectSuggestion = useCallback(async (suggestion) => {
    const placeName = suggestion.display_name || suggestion.name;
    updateField('place', placeName);
    setShowSuggestions(false);
    setSuggestions([]);
    setPlaceStatus({ type: '', text: '' });

    try {
      const data = await geocodePlace(placeName);
      setLocation({ lat: data.latitude, lon: data.longitude, tz: data.timezone, display: data.display_name });
    } catch {
      // No coordinates — backend will resolve from place name
    }
  }, [updateField]);

  useEffect(() => {
    const handleClick = (e) => {
      if (placeRef.current && !placeRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.date || !form.place) {
      setError('Please fill in all required fields.');
      return;
    }

    const [year, month, day] = form.date.split('-').map(Number);
    let hour = parseInt(form.hour, 10);
    const minute = parseInt(form.minute, 10);
    if (form.ampm === 'PM' && hour !== 12) hour += 12;
    if (form.ampm === 'AM' && hour === 12) hour = 0;

    const payload = {
      name: form.name,
      year, month, day,
      hour, minute, second: 0,
      place_name: form.place,
      latitude: location.lat,
      longitude: location.lon,
      timezone: location.tz,
    };

    onSubmit(payload);
  };

  const displayError = error || serverError;

  return (
    <section className="birth-form-section">
      <div className="page-container">
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">{'\u0950'}</div>
            <h2 className="form-header-title">Birth Details</h2>
            <p className="form-header-desc">Enter your precise birth information for an accurate Kundli</p>
          </div>

          <form className="birth-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-field">
              <label className="field-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                className="field-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>

            {/* Gender */}
            <div className="form-field">
              <label className="field-label">Gender</label>
              <div className="gender-group">
                {['male', 'female', 'other'].map(g => (
                  <label key={g} className={`gender-option ${form.gender === g ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={(e) => updateField('gender', e.target.value)}
                    />
                    <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date + Time row */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="field-input"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  Time of Birth
                </label>
                <div className="time-selects">
                  <select className="field-select" value={form.hour} onChange={(e) => updateField('hour', e.target.value)}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="time-colon">:</span>
                  <select className="field-select" value={form.minute} onChange={(e) => updateField('minute', e.target.value)}>
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className="field-select ampm-select" value={form.ampm} onChange={(e) => updateField('ampm', e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Place */}
            <div className="form-field" ref={placeRef}>
              <label className="field-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Place of Birth
              </label>
              <input
                type="text"
                className="field-input"
                placeholder="Start typing a city name..."
                value={form.place}
                onChange={(e) => handlePlaceChange(e.target.value)}
                required
              />
              {placeStatus.text && (
                <div className={`place-status ${placeStatus.type}`}>
                  {placeStatus.text}
                </div>
              )}
            </div>

            {displayError && (
              <div className="form-error">{displayError}</div>
            )}

            <button type="submit" className="submit-btn">
              Generate Kundli
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
