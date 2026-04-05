import './Navbar.css';

export default function Navbar({ onGetStarted, showBack, onBack }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={onBack || undefined}>
          {showBack && (
            <button className="nav-back" onClick={onBack} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <span className="brand-icon">&#x2609;</span>
          <span className="brand-text">Nakshatra<span className="brand-accent">Ved</span></span>
        </div>

        <div className="navbar-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
        </div>

        <button className="nav-cta" onClick={onGetStarted}>
          Get Your Kundli
        </button>
      </div>
    </nav>
  );
}
