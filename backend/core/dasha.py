"""Vimshottari Dasha calculation engine.

Computes Mahadasha, Antardasha, and Pratyantardasha periods
based on Moon's nakshatra position at birth.
"""

import swisseph as swe
from backend.core.calculations import longitude_to_nakshatra

# Vimshottari Dasha years for each planet
DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}

# Fixed sequence of Mahadasha lords
DASHA_SEQUENCE = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury",
]

TOTAL_DASHA_YEARS = 120  # Sum of all dasha years
DAYS_PER_YEAR = 365.25   # Julian year


def _jd_to_date_str(jd: float) -> str:
    """Convert Julian Day to ISO date string."""
    year, month, day, hour = swe.revjul(jd, swe.GREG_CAL)
    return f"{year:04d}-{month:02d}-{int(day):02d}"


def get_birth_dasha(moon_longitude: float) -> tuple[str, float]:
    """Determine the Mahadasha lord at birth and remaining years.

    Args:
        moon_longitude: Moon's sidereal longitude

    Returns:
        (dasha_lord, remaining_years)
    """
    _, _, _, nak_lord = longitude_to_nakshatra(moon_longitude)
    total_years = DASHA_YEARS[nak_lord]

    # How far Moon has traversed the current nakshatra
    nak_span = 13.333333333333334
    nak_index = int((moon_longitude % 360.0) / nak_span)
    if nak_index >= 27:
        nak_index = 26
    elapsed_in_nak = (moon_longitude % 360.0) - (nak_index * nak_span)
    fraction_elapsed = elapsed_in_nak / nak_span

    remaining_years = total_years * (1.0 - fraction_elapsed)
    return (nak_lord, remaining_years)


def _get_sequence_from(lord: str) -> list[str]:
    """Get dasha sequence starting from a given lord."""
    idx = DASHA_SEQUENCE.index(lord)
    return DASHA_SEQUENCE[idx:] + DASHA_SEQUENCE[:idx]


def compute_mahadasha_periods(moon_longitude: float, birth_jd: float) -> list[dict]:
    """Compute all 9 Mahadasha periods from birth.

    Returns list of dicts with: lord, start_date, end_date, duration_days, start_jd, end_jd
    """
    birth_lord, remaining_years = get_birth_dasha(moon_longitude)
    sequence = _get_sequence_from(birth_lord)

    periods = []
    current_jd = birth_jd

    for i, lord in enumerate(sequence):
        if i == 0:
            duration_years = remaining_years
        else:
            duration_years = DASHA_YEARS[lord]

        duration_days = duration_years * DAYS_PER_YEAR
        end_jd = current_jd + duration_days

        periods.append({
            "lord": lord,
            "start_jd": current_jd,
            "end_jd": end_jd,
            "start_date": _jd_to_date_str(current_jd),
            "end_date": _jd_to_date_str(end_jd),
            "duration_days": round(duration_days, 2),
        })

        current_jd = end_jd

    return periods


def compute_antardasha_periods(mahadasha_lord: str,
                                maha_start_jd: float,
                                maha_end_jd: float) -> list[dict]:
    """Compute Antardasha (sub-period) periods within a Mahadasha.

    Within each Mahadasha, Antardashas follow the same sequence
    starting from the Mahadasha lord. Duration is proportional.
    """
    maha_duration = maha_end_jd - maha_start_jd
    sequence = _get_sequence_from(mahadasha_lord)

    periods = []
    current_jd = maha_start_jd

    for lord in sequence:
        proportion = DASHA_YEARS[lord] / TOTAL_DASHA_YEARS
        duration_days = maha_duration * proportion
        end_jd = current_jd + duration_days

        periods.append({
            "lord": lord,
            "start_jd": current_jd,
            "end_jd": end_jd,
            "start_date": _jd_to_date_str(current_jd),
            "end_date": _jd_to_date_str(end_jd),
            "duration_days": round(duration_days, 2),
        })

        current_jd = end_jd

    return periods


def compute_pratyantardasha_periods(antardasha_lord: str,
                                     antar_start_jd: float,
                                     antar_end_jd: float) -> list[dict]:
    """Compute Pratyantardasha (sub-sub-period) within an Antardasha."""
    antar_duration = antar_end_jd - antar_start_jd
    sequence = _get_sequence_from(antardasha_lord)

    periods = []
    current_jd = antar_start_jd

    for lord in sequence:
        proportion = DASHA_YEARS[lord] / TOTAL_DASHA_YEARS
        duration_days = antar_duration * proportion
        end_jd = current_jd + duration_days

        periods.append({
            "lord": lord,
            "start_jd": current_jd,
            "end_jd": end_jd,
            "start_date": _jd_to_date_str(current_jd),
            "end_date": _jd_to_date_str(end_jd),
            "duration_days": round(duration_days, 2),
        })

        current_jd = end_jd

    return periods


def compute_full_dasha_tree(moon_longitude: float, birth_jd: float) -> list[dict]:
    """Compute full 3-level dasha tree: Mahadasha → Antardasha → Pratyantardasha.

    Returns nested structure for API response.
    """
    from backend.core.models import DashaPeriod

    mahadashas = compute_mahadasha_periods(moon_longitude, birth_jd)
    result = []

    for md in mahadashas:
        antardashas = compute_antardasha_periods(
            md["lord"], md["start_jd"], md["end_jd"]
        )

        antar_periods = []
        for ad in antardashas:
            pratyantardashas = compute_pratyantardasha_periods(
                ad["lord"], ad["start_jd"], ad["end_jd"]
            )

            pratyantar_periods = [
                DashaPeriod(
                    lord=pd["lord"],
                    start_date=pd["start_date"],
                    end_date=pd["end_date"],
                    duration_days=pd["duration_days"],
                    sub_periods=None,
                )
                for pd in pratyantardashas
            ]

            antar_periods.append(DashaPeriod(
                lord=ad["lord"],
                start_date=ad["start_date"],
                end_date=ad["end_date"],
                duration_days=ad["duration_days"],
                sub_periods=pratyantar_periods,
            ))

        result.append(DashaPeriod(
            lord=md["lord"],
            start_date=md["start_date"],
            end_date=md["end_date"],
            duration_days=md["duration_days"],
            sub_periods=antar_periods,
        ))

    return result
