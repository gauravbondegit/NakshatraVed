# NakshatraVed — Vedic Kundali Calculator

> "Millionaires don't believe in astrology. Billionaires do."

NakshatraVed is a free, open-source Vedic astrology birth chart calculator. Enter your birth details and get a fully accurate Kundali — with planetary positions, divisional charts, Dasha timelines, yoga detection, and life insights — computed locally using the Swiss Ephemeris. No subscriptions, no ads, no data stored.

---

## Live Demo

🔗 **[Coming soon — add your deployed URL here]**

---

## Screenshots

| Home Page | Birth Form | Dashboard |
|-----------|------------|-----------|
| ![Home](docs/screenshots/home.png) | ![Form](docs/screenshots/form.png) | ![Dashboard](docs/screenshots/dashboard.png) |

> _Replace the placeholders above with actual screenshots after deployment._

---

## File Structure

```
NakshatraVed/
├── backend/
│   ├── api/
│   │   ├── geocoding.py        # Location & timezone resolution
│   │   └── routes.py           # FastAPI route handlers
│   ├── core/
│   │   ├── calculations.py     # Core Kundali computation
│   │   ├── aspects.py          # Graha Drishti (planetary aspects)
│   │   ├── dasha.py            # Vimshottari Dasha system
│   │   ├── divisional_charts.py# D1, D2, D3, D4, D9, D10 divisional charts
│   │   ├── ephemeris.py        # Swiss Ephemeris wrapper
│   │   ├── models.py           # Pydantic data models
│   │   ├── strength.py         # Shadbala / planetary strength
│   │   └── yogas.py            # Yoga detection engine
│   ├── config.py               # Ayanamsa, house system settings
│   ├── main.py                 # FastAPI app entry point
│   └── requirements.txt
├── data/                       # Swiss Ephemeris binary data files
├── frontend-react/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── dashboard/      # Chart, Dasha, Yoga, Planet sections
│   │   │   ├── Navbar.jsx
│   │   │   ├── ZodiacWheel.jsx
│   │   │   └── MoonPhases.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BirthForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── utils/              # API calls, helpers, constants
│   │   └── styles/global.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Vite |
| Backend | Python 3.13, FastAPI, Uvicorn |
| Astrology Engine | Swiss Ephemeris (pyswisseph) |
| Geocoding | Geopy (Nominatim, offline-capable) |
| Timezone | timezonefinder + pytz |
| PDF Export | jsPDF + html2canvas |

---

## Features

- **Birth Chart (D1)** — North Indian diamond layout with all 9 planets and ascendant
- **6 Divisional Charts** — D1, D2 (Hora), D3 (Drekkana), D4 (Chaturthamsa), D9 (Navamsa), D10 (Dashamsa)
- **Vimshottari Dasha** — Full 120-year Mahadasha + Antardasha breakdown
- **Yoga Detection** — Panch Mahapurusha Yogas, Gajakesari, Budhaditya, Raja Yogas, Viparita Raja, Manglik Dosha, and more
- **Graha Drishti** — Traditional Parashari planetary aspect analysis
- **Life Insights** — Personalized readings for career, wealth, love, and health
- **PDF Export** — Download your full chart as a PDF
- **Zero data stored** — All computation is on-demand; nothing is logged or saved
- **Lahiri Ayanamsa** — Indian government standard for sidereal calculations

---

## Usage

### Prerequisites

- Python 3.11+
- Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/your-username/NakshatraVed.git
cd NakshatraVed
```

### 2. Set up the backend

```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate        # Windows: ..\.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set up the frontend

```bash
cd frontend-react
npm install
```

### 4. Run in development

Open two terminals:

```bash
# Terminal 1 — backend
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — frontend
cd frontend-react
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 5. Build for production

```bash
cd frontend-react
npm run build
```

Then serve everything from the backend alone:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

The FastAPI server will serve the built React frontend at `/`.

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT
