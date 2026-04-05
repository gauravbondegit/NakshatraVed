"""Divisional chart (Varga) calculations — Parashari method.

Implements: D1 (Rashi), D2 (Hora), D3 (Drekkana), D4 (Chaturthamsa),
D9 (Navamsa), D10 (Dashamsa).

Each function takes a sidereal longitude and returns the rashi index (0-11)
in that divisional chart.
"""

from backend.core.models import ChartData


def calc_d1(longitude: float) -> int:
    """D1 — Rashi chart. Identity mapping."""
    return int((longitude % 360.0) / 30.0)


def calc_d2(longitude: float) -> int:
    """D2 — Hora chart.

    Odd signs: first 15° = Sun (Simha/4), second 15° = Moon (Karka/3)
    Even signs: first 15° = Moon (Karka/3), second 15° = Sun (Simha/4)
    """
    rashi = int((longitude % 360.0) / 30.0)
    degree_in_rashi = longitude % 30.0
    is_odd_sign = (rashi % 2 == 0)  # 0-indexed: Mesha=0 is odd sign

    if is_odd_sign:
        return 4 if degree_in_rashi < 15.0 else 3  # Simha then Karka
    else:
        return 3 if degree_in_rashi < 15.0 else 4  # Karka then Simha


def calc_d3(longitude: float) -> int:
    """D3 — Drekkana chart.

    Each sign divided into 3 parts of 10° each.
    Odd signs: part maps to signs 1st, 5th, 9th from the sign.
    Even signs: part maps to signs 9th, 5th, 1st from the sign.
    """
    rashi = int((longitude % 360.0) / 30.0)
    degree_in_rashi = longitude % 30.0
    part = int(degree_in_rashi / 10.0)
    if part > 2:
        part = 2
    is_odd = (rashi % 2 == 0)  # 0-indexed

    if is_odd:
        offsets = [0, 4, 8]  # 1st, 5th, 9th
    else:
        offsets = [8, 4, 0]  # 9th, 5th, 1st

    return (rashi + offsets[part]) % 12


def calc_d4(longitude: float) -> int:
    """D4 — Chaturthamsa chart.

    Each sign divided into 4 parts of 7.5° each.
    Parts map to: sign itself, +3, +6, +9 from the sign.
    """
    rashi = int((longitude % 360.0) / 30.0)
    degree_in_rashi = longitude % 30.0
    part = int(degree_in_rashi / 7.5)
    if part > 3:
        part = 3

    return (rashi + part * 3) % 12


def calc_d9(longitude: float) -> int:
    """D9 — Navamsa chart (most important divisional chart).

    Each sign divided into 9 parts of 3°20' each.
    The navamsa rashi cycles through all 12 signs starting from:
    - Fire signs (Mesha, Simha, Dhanu): start from Mesha (0)
    - Earth signs (Vrishabha, Kanya, Makara): start from Makara (9)
    - Air signs (Mithuna, Tula, Kumbha): start from Tula (6)
    - Water signs (Karka, Vrischika, Meena): start from Karka (3)
    """
    longitude = longitude % 360.0
    # Each navamsa spans 3°20' = 3.33333°
    # Total navamsas from 0° Aries = longitude / 3.33333
    navamsa_index = int(longitude / 3.333333333333333)
    return navamsa_index % 12


def calc_d10(longitude: float) -> int:
    """D10 — Dashamsa chart.

    Each sign divided into 10 parts of 3° each.
    Odd signs: count 10 signs starting from the sign itself.
    Even signs: count 10 signs starting from the 9th sign from itself.
    """
    rashi = int((longitude % 360.0) / 30.0)
    degree_in_rashi = longitude % 30.0
    part = int(degree_in_rashi / 3.0)
    if part > 9:
        part = 9
    is_odd = (rashi % 2 == 0)  # 0-indexed

    if is_odd:
        return (rashi + part) % 12
    else:
        return (rashi + 8 + part) % 12  # 9th from sign = +8 in 0-indexed


# Registry of divisional chart functions
VARGA_FUNCTIONS = {
    "D1": calc_d1,
    "D2": calc_d2,
    "D3": calc_d3,
    "D4": calc_d4,
    "D9": calc_d9,
    "D10": calc_d10,
}

VARGA_NAMES = {
    "D1": "Rashi",
    "D2": "Hora",
    "D3": "Drekkana",
    "D4": "Chaturthamsa",
    "D9": "Navamsa",
    "D10": "Dashamsa",
}


def compute_divisional_chart(planet_positions: list, ascendant_longitude: float,
                              division: str) -> ChartData:
    """Compute a divisional chart for all planets.

    Args:
        planet_positions: list of PlanetPosition objects (from D1 calculation)
        ascendant_longitude: sidereal longitude of ascendant
        division: chart type key, e.g. "D9"

    Returns:
        ChartData with planet rashi mappings in the divisional chart
    """
    calc_fn = VARGA_FUNCTIONS[division]
    planet_rashis = {}
    for planet in planet_positions:
        planet_rashis[planet.name] = calc_fn(planet.longitude)

    asc_rashi = calc_fn(ascendant_longitude)

    return ChartData(
        chart_type=f"{division} ({VARGA_NAMES[division]})",
        planet_rashis=planet_rashis,
        ascendant_rashi=asc_rashi,
    )


def compute_all_divisional_charts(planet_positions: list,
                                   ascendant_longitude: float) -> dict[str, ChartData]:
    """Compute all 6 divisional charts."""
    charts = {}
    for division in VARGA_FUNCTIONS:
        charts[division] = compute_divisional_chart(
            planet_positions, ascendant_longitude, division
        )
    return charts
