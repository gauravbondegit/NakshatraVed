"""Core Vedic astrological calculations.

Converts raw sidereal longitudes into Rashi, Nakshatra, House, and Dignity.
"""

from backend.core.ephemeris import (
    get_all_planet_positions, get_houses_and_ascendant, get_ayanamsa
)
from backend.core.models import PlanetPosition

# 12 Rashis (sidereal signs) — each 30°
RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka",
    "Simha", "Kanya", "Tula", "Vrischika",
    "Dhanu", "Makara", "Kumbha", "Meena",
]

RASHI_ENGLISH = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

RASHI_LORDS = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
    4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
    8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
}

# 27 Nakshatras — each 13°20' (13.3333°)
NAKSHATRAS = [
    ("Ashwini", "Ketu"), ("Bharani", "Venus"), ("Krittika", "Sun"),
    ("Rohini", "Moon"), ("Mrigashira", "Mars"), ("Ardra", "Rahu"),
    ("Punarvasu", "Jupiter"), ("Pushya", "Saturn"), ("Ashlesha", "Mercury"),
    ("Magha", "Ketu"), ("Purva Phalguni", "Venus"), ("Uttara Phalguni", "Sun"),
    ("Hasta", "Moon"), ("Chitra", "Mars"), ("Swati", "Rahu"),
    ("Vishakha", "Jupiter"), ("Anuradha", "Saturn"), ("Jyeshtha", "Mercury"),
    ("Moola", "Ketu"), ("Purva Ashadha", "Venus"), ("Uttara Ashadha", "Sun"),
    ("Shravana", "Moon"), ("Dhanishta", "Mars"), ("Shatabhisha", "Rahu"),
    ("Purva Bhadrapada", "Jupiter"), ("Uttara Bhadrapada", "Saturn"), ("Revati", "Mercury"),
]

NAK_SPAN = 13.333333333333334  # 13°20' in decimal degrees
PADA_SPAN = 3.333333333333333  # 3°20' per pada

# Exaltation rashis (index) for each planet
EXALTATION = {
    "Sun": 0, "Moon": 1, "Mars": 9, "Mercury": 5,
    "Jupiter": 3, "Venus": 11, "Saturn": 6,
    "Rahu": 1, "Ketu": 7,
}

# Debilitation rashis — exactly opposite exaltation
DEBILITATION = {
    "Sun": 6, "Moon": 7, "Mars": 3, "Mercury": 11,
    "Jupiter": 9, "Venus": 5, "Saturn": 0,
    "Rahu": 7, "Ketu": 1,
}

# Own signs for each planet (rashi indices)
OWN_SIGNS = {
    "Sun": [4],
    "Moon": [3],
    "Mars": [0, 7],
    "Mercury": [2, 5],
    "Jupiter": [8, 11],
    "Venus": [1, 6],
    "Saturn": [9, 10],
    "Rahu": [10],  # Some traditions assign Aquarius
    "Ketu": [7],   # Some traditions assign Scorpio
}

# Mooltrikona signs and degree ranges
MOOLTRIKONA = {
    "Sun": (4, 0, 20),       # Simha 0-20°
    "Moon": (1, 3, 30),      # Vrishabha 3-30°
    "Mars": (0, 0, 12),      # Mesha 0-12°
    "Mercury": (5, 15, 20),  # Kanya 15-20°
    "Jupiter": (8, 0, 10),   # Dhanu 0-10°
    "Venus": (6, 0, 15),     # Tula 0-15°
    "Saturn": (10, 0, 20),   # Kumbha 0-20°
}


def longitude_to_rashi(longitude: float) -> tuple[int, str, str, float]:
    """Convert longitude to rashi.

    Returns: (rashi_index, rashi_name, rashi_english, degree_in_rashi)
    """
    longitude = longitude % 360.0
    rashi_index = int(longitude / 30.0)
    degree_in_rashi = longitude % 30.0
    return (rashi_index, RASHIS[rashi_index], RASHI_ENGLISH[rashi_index], degree_in_rashi)


def longitude_to_nakshatra(longitude: float) -> tuple[int, str, int, str]:
    """Convert longitude to nakshatra and pada.

    Returns: (nak_index, nak_name, pada, nak_lord)
    """
    longitude = longitude % 360.0
    nak_index = int(longitude / NAK_SPAN)
    if nak_index >= 27:
        nak_index = 26
    nak_name, nak_lord = NAKSHATRAS[nak_index]
    degree_in_nak = longitude - (nak_index * NAK_SPAN)
    pada = int(degree_in_nak / PADA_SPAN) + 1
    if pada > 4:
        pada = 4
    return (nak_index, nak_name, pada, nak_lord)


def get_house_number(planet_longitude: float, ascendant_longitude: float) -> int:
    """Get house number (1-12) using Whole Sign system."""
    asc_rashi = int((ascendant_longitude % 360.0) / 30.0)
    planet_rashi = int((planet_longitude % 360.0) / 30.0)
    house = ((planet_rashi - asc_rashi) % 12) + 1
    return house


def get_planet_dignity(planet_name: str, rashi_index: int, degree_in_rashi: float) -> str:
    """Determine planetary dignity in a given rashi."""
    # Check Mooltrikona first (it takes priority over own sign)
    if planet_name in MOOLTRIKONA:
        mt_rashi, mt_start, mt_end = MOOLTRIKONA[planet_name]
        if rashi_index == mt_rashi and mt_start <= degree_in_rashi < mt_end:
            return "Mooltrikona"

    if planet_name in EXALTATION and EXALTATION[planet_name] == rashi_index:
        return "Exalted"
    if planet_name in DEBILITATION and DEBILITATION[planet_name] == rashi_index:
        return "Debilitated"
    if planet_name in OWN_SIGNS and rashi_index in OWN_SIGNS[planet_name]:
        return "Own Sign"

    return "Neutral"


def compute_full_chart(jd_ut: float, lat: float, lon: float) -> dict:
    """Compute complete kundali chart data.

    Returns dict with: planets, ascendant, houses, ayanamsa
    """
    positions = get_all_planet_positions(jd_ut)
    houses_data = get_houses_and_ascendant(jd_ut, lat, lon)
    ayanamsa = get_ayanamsa(jd_ut)
    asc_long = houses_data["ascendant"]

    # Build ascendant as a PlanetPosition
    asc_rashi_idx, asc_rashi, asc_rashi_en, asc_deg = longitude_to_rashi(asc_long)
    asc_nak_idx, asc_nak, asc_pada, asc_nak_lord = longitude_to_nakshatra(asc_long)
    ascendant = PlanetPosition(
        name="Lagna (Ascendant)",
        longitude=asc_long,
        latitude=0.0,
        speed=0.0,
        is_retrograde=False,
        rashi=asc_rashi,
        rashi_english=asc_rashi_en,
        rashi_index=asc_rashi_idx,
        degree_in_rashi=round(asc_deg, 4),
        nakshatra=asc_nak,
        nakshatra_pada=asc_pada,
        nakshatra_lord=asc_nak_lord,
        house=1,
        dignity="",
    )

    # Build planet positions
    planet_list = []
    for name, pos in positions.items():
        lng = pos["longitude"]
        rashi_idx, rashi, rashi_en, deg = longitude_to_rashi(lng)
        nak_idx, nak, pada, nak_lord = longitude_to_nakshatra(lng)
        house = get_house_number(lng, asc_long)
        dignity = get_planet_dignity(name, rashi_idx, deg)

        planet_list.append(PlanetPosition(
            name=name,
            longitude=lng,
            latitude=pos["latitude"],
            speed=pos["speed_long"],
            is_retrograde=pos["is_retrograde"],
            rashi=rashi,
            rashi_english=rashi_en,
            rashi_index=rashi_idx,
            degree_in_rashi=round(deg, 4),
            nakshatra=nak,
            nakshatra_pada=pada,
            nakshatra_lord=nak_lord,
            house=house,
            dignity=dignity,
        ))

    return {
        "planets": planet_list,
        "ascendant": ascendant,
        "houses": houses_data["cusps"],
        "ayanamsa": round(ayanamsa, 6),
    }
