import { useState, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BirthForm from './pages/BirthForm';
import LoadingOverlay from './components/LoadingOverlay';
import Dashboard from './pages/Dashboard';
import { calculateKundali } from './utils/api';

export default function App() {
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState('');
  const formPayloadRef = useRef(null);

  const navigateTo = useCallback((v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(async (payload) => {
    setFormError('');
    setLoading(true);

    try {
      const data = await calculateKundali(payload);
      setResult(data);
      setLoading(false);
      navigateTo('dashboard');
    } catch (err) {
      console.error('Kundali calculation failed:', err);
      setFormError(err.message || 'Calculation failed. Make sure the backend server is running.');
      setLoading(false);
    }
  }, [navigateTo]);

  return (
    <div className="app">
      {view === 'home' && (
        <>
          <Navbar onGetStarted={() => navigateTo('form')} />
          <HomePage onGetStarted={() => navigateTo('form')} />
        </>
      )}
      {view === 'form' && (
        <>
          <Navbar onGetStarted={() => navigateTo('form')} showBack onBack={() => navigateTo('home')} />
          <BirthForm onSubmit={handleSubmit} serverError={formError} />
        </>
      )}
      {loading && <LoadingOverlay />}
      {view === 'dashboard' && (
        <Dashboard result={result} onNewChart={() => navigateTo('home')} />
      )}
    </div>
  );
}
