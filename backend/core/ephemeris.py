"""Swiss Ephemeris wrapper for Vedic astrology calculations.

Uses Lahiri (Chitrapaksha) ayanamsa and sidereal zodiac.
"""

import swisseph as swe
from backend.config import EPHE_PATH, DEFAULT_HOUSE_SYSTEM

# Planet ID mapping — the 9 Vedic grahas
PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.TRUE_NODE,
}
# Ketu is always computed as Rahu + 180°

CALC_FLAGS = swe.FLG_SIDEREAL | swe.FLG_SPEED

_initialized = False


def init_ephemeris(ephe_path: str = EPHE_PATH):
    """Initialize Swiss Ephemeris with Lahiri ayanamsa."""
    global _initialized
    swe.set_ephe_path(ephe_path)
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    _initialized = True


def _ensure_init():
    if not _initialized:
        init_ephemeris()


def datetime_to_jd(year: int, month: int, day: int,
                    hour: int, minute: int, second: int,
                    tz_offset: float) -> float:
    """Convert local datetime to Julian Day (UT).

    Args:
        tz_offset: UTC offset in hours (e.g., 5.5 for IST)
    """
    ut_hour = hour + minute / 60.0 + second / 3600.0 - tz_offset
    return swe.julday(year, month, day, ut_hour, swe.GREG_CAL)


def get_planet_position(jd_ut: float, planet_id: int) -> dict:
    """Get sidereal position of a single planet."""
    _ensure_init()
    result, _ = swe.calc_ut(jd_ut, planet_id, CALC_FLAGS)
    return {
        "longitude": result[0],
        "latitude": result[1],
        "distance": result[2],
        "speed_long": result[3],
        "is_retrograde": result[3] < 0,
    }


def get_all_planet_positions(jd_ut: float) -> dict:
    """Get sidereal positions of all 9 Vedic planets."""
    _ensure_init()
    positions = {}

    for name, planet_id in PLANETS.items():
        positions[name] = get_planet_position(jd_ut, planet_id)

    # Ketu = Rahu + 180°
    rahu = positions["Rahu"]
    positions["Ketu"] = {
        "longitude": (rahu["longitude"] + 180.0) % 360.0,
        "latitude": -rahu["latitude"],
        "distance": rahu["distance"],
        "speed_long": rahu["speed_long"],
        "is_retrograde": True,  # Rahu/Ketu are always retrograde
    }

    return positions


def get_houses_and_ascendant(jd_ut: float, lat: float, lon: float) -> dict:
    """Get house cusps and ascendant using Whole Sign houses."""
    _ensure_init()
    cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, DEFAULT_HOUSE_SYSTEM,
                                  swe.FLG_SIDEREAL)
    return {
        "cusps": list(cusps),
        "ascendant": ascmc[0],
        "mc": ascmc[1],
    }


def get_ayanamsa(jd_ut: float) -> float:
    """Get the Lahiri ayanamsa value for the given Julian Day."""
    _ensure_init()
    return swe.get_ayanamsa_ut(jd_ut)


def close_ephemeris():
    """Clean up Swiss Ephemeris resources."""
    swe.close()
