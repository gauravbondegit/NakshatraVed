"""Planetary strength and combustion calculations.

Provides dignity-based scoring and combustion detection.
"""

from backend.core.models import PlanetPosition

# Combustion orbs (degrees from Sun) — planet is combust if within this range
COMBUSTION_ORBS = {
    "Moon": 12.0,
    "Mars": 17.0,
    "Mercury": 14.0,  # 12° when retrograde, but we use 14° as general rule
    "Jupiter": 11.0,
    "Venus": 10.0,
    "Saturn": 15.0,
}

# Dignity scores for quick strength assessment
DIGNITY_SCORES = {
    "Exalted": 20,
    "Mooltrikona": 15,
    "Own Sign": 12,
    "Neutral": 7,
    "Debilitated": 2,
}

# Directional strength (Dig Bala) — planet strong in which house
DIG_BALA = {
    "Jupiter": 1,   # Strong in 1st house (East)
    "Mercury": 1,   # Strong in 1st house (East)
    "Sun": 10,      # Strong in 10th house (South)
    "Mars": 10,     # Strong in 10th house (South)
    "Saturn": 7,    # Strong in 7th house (West)
    "Moon": 4,      # Strong in 4th house (North)
    "Venus": 4,     # Strong in 4th house (North)
}

# Natural benefics and malefics
NATURAL_BENEFICS = {"Jupiter", "Venus", "Moon", "Mercury"}
NATURAL_MALEFICS = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}


def is_combust(planet: PlanetPosition, sun: PlanetPosition) -> bool:
    """Check if a planet is combust (too close to Sun)."""
    if planet.name not in COMBUSTION_ORBS:
        return False

    angular_diff = abs(planet.longitude - sun.longitude)
    if angular_diff > 180:
        angular_diff = 360 - angular_diff

    return angular_diff <= COMBUSTION_ORBS[planet.name]


def get_dignity_score(planet: PlanetPosition) -> int:
    """Get numerical dignity score for a planet."""
    return DIGNITY_SCORES.get(planet.dignity, 7)


def has_dig_bala(planet: PlanetPosition) -> bool:
    """Check if planet has directional strength."""
    if planet.name in DIG_BALA:
        return planet.house == DIG_BALA[planet.name]
    return False


def compute_strength_summary(planets: list[PlanetPosition]) -> dict[str, dict]:
    """Compute strength summary for all planets.

    Returns dict of planet name -> strength info.
    """
    sun = next((p for p in planets if p.name == "Sun"), None)
    summary = {}

    for planet in planets:
        strength = {
            "dignity": planet.dignity,
            "dignity_score": get_dignity_score(planet),
            "is_retrograde": planet.is_retrograde,
            "is_combust": is_combust(planet, sun) if sun and planet.name != "Sun" else False,
            "has_dig_bala": has_dig_bala(planet),
            "is_natural_benefic": planet.name in NATURAL_BENEFICS,
        }

        # Overall strength rating
        score = strength["dignity_score"]
        if strength["is_retrograde"] and planet.name not in ("Rahu", "Ketu"):
            score -= 3  # Retrograde weakens slightly
        if strength["is_combust"]:
            score -= 5  # Combustion significantly weakens
        if strength["has_dig_bala"]:
            score += 5  # Directional strength helps

        if score >= 18:
            strength["overall"] = "Very Strong"
        elif score >= 12:
            strength["overall"] = "Strong"
        elif score >= 7:
            strength["overall"] = "Moderate"
        elif score >= 4:
            strength["overall"] = "Weak"
        else:
            
            strength["overall"] = "Very Weak"

        strength["total_score"] = score
        summary[planet.name] = strength

    return summary
