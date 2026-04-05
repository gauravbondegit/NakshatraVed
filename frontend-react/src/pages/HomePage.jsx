import ZodiacWheel from '../components/ZodiacWheel';
import MoonPhases from '../components/MoonPhases';
import sunLogo from '../assets/sun-logo.png';
import './HomePage.css';

export default function HomePage({ onGetStarted }) {
  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-elements">
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-circle hero-circle-3" />
          <div className="hero-dots" />
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="hero-title-dark">Millionaires don't believe in astrology</span><br />
              <span className="hero-title-accent">Billionaires do</span>
            </h1>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">9</span>
                <span className="stat-label">Planets Tracked</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Divisional Charts</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free Forever</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-number">0</span>
                <span className="stat-label">Data Stored</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <ZodiacWheel />
          </div>
        </div>

        <div className="hero-moon-phases">
          <MoonPhases />
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="page-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Comprehensive Vedic Astrology</h2>
            <p className="section-desc">Everything you need for an accurate and insightful Kundli reading</p>
          </div>

          <div className="features-grid">
            {[
              { icon: '', title: 'Birth Chart (D1)', desc: 'Precise Rashi chart with North Indian diamond layout showing all planetary positions at your time of birth.' },
              { icon: '', title: '6 Divisional Charts', desc: 'D1 through D10 charts including Navamsa (D9) for marriage and Dashamsa (D10) for career analysis.' },
              { icon: '', title: 'Vimshottari Dasha', desc: 'Complete 120-year planetary period system with Mahadasha and Antardasha breakdowns.' },
              { icon: '', title: 'Yoga Detection', desc: 'Automatic detection of auspicious and challenging planetary combinations in your chart.' },
              { icon: '', title: 'Graha Drishti', desc: 'Full planetary aspect analysis following traditional Parashari rules for deeper chart interpretation.' },
              { icon: '', title: 'Life Insights', desc: 'Personalized interpretations for career, wealth, love, and health based on your planetary positions.' },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="about-section" id="about">
        <div className="page-container">
          <div className="section-header">
            <span className="section-tag">About</span>
          </div>
          <div className="about-grid">
            <div className="about-visual">
              <img src={sunLogo} alt="Sun logo" className="about-sun-logo" />
            </div>
            <div className="about-content">
              <h2 className="section-title">Astronomical Precision,<br />Ancient Wisdom</h2>
              <p className="about-text">
                Our Kundli calculator combines the computational accuracy of the Swiss Ephemeris
                — the same engine used by professional astronomers — with the interpretive
                framework of Vedic (Jyotish) astrology.
              </p>
              <p className="about-text">
                Every calculation uses the Lahiri Ayanamsa and accounts for your exact birth
                location and timezone, ensuring your chart is as precise as modern science allows.
              </p>
              <div className="about-badges">
                <span className="about-badge">Swiss Ephemeris</span>
                <span className="about-badge">Lahiri Ayanamsa</span>
                <span className="about-badge">No Paid APIs</span>
                <span className="about-badge">100% Local</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="page-container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Discover Your Cosmic Blueprint?</h2>
            <p className="cta-desc">Generate your complete Vedic birth chart in seconds — absolutely free.</p>
            <button className="hero-cta" onClick={onGetStarted}>
              Create Your Kundli Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
