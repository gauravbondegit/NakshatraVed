"""Vedic planetary aspects (Graha Drishti).

In Vedic astrology, aspects are house-based (not angle-based like Western):
- Every planet has full 7th house aspect
- Mars: additional 4th and 8th house aspects
- Jupiter: additional 5th and 9th house aspects
- Saturn: additional 3rd and 10th house aspects
"""

from backend.core.models import AspectInfo

# Special aspects by planet (offsets from planet's house, 0-indexed)
# All planets get the 7th (offset 6)
SPECIAL_ASPECTS = {
    "Mars": [3, 6, 7],       # 4th, 7th, 8th
    "Jupiter": [4, 6, 8],    # 5th, 7th, 9th
    "Saturn": [2, 6, 9],     # 3rd, 7th, 10th
}

DEFAULT_ASPECTS = [6]  # 7th house aspect only


def get_aspected_houses(planet_name: str, planet_house: int) -> list[int]:
    """Get list of houses (1-12) that a planet aspects from its position.

    Args:
        planet_name: Name of the planet
        planet_house: House number (1-12) where the planet is placed
    """
    offsets = SPECIAL_ASPECTS.get(planet_name, DEFAULT_ASPECTS)
    aspected = []
    for offset in offsets:
        house = ((planet_house - 1 + offset) % 12) + 1
        aspected.append(house)
    return aspected


def _aspect_type_label(planet_name: str, offset: int) -> str:
    """Human-readable label for an aspect type."""
    house_num = offset + 1
    if planet_name in SPECIAL_ASPECTS and offset != 6:
        return f"{house_num}th special ({planet_name})"
    return f"{house_num}th aspect"


def compute_aspect_table(planet_houses: dict[str, int]) -> list[AspectInfo]:
    """Compute all planetary aspects.

    Args:
        planet_houses: dict mapping planet name -> house number (1-12)

    Returns:
        List of AspectInfo describing each aspect relationship
    """
    # Build reverse lookup: house -> list of planets in that house
    house_to_planets = {}
    for pname, house in planet_houses.items():
        house_to_planets.setdefault(house, []).append(pname)

    aspects = []
    for planet_name, planet_house in planet_houses.items():
        offsets = SPECIAL_ASPECTS.get(planet_name, DEFAULT_ASPECTS)
        for offset in offsets:
            target_house = ((planet_house - 1 + offset) % 12) + 1
            # Check which planets sit in the target house
            for target_planet in house_to_planets.get(target_house, []):
                if target_planet != planet_name:
                    aspects.append(AspectInfo(
                        aspecting_planet=planet_name,
                        aspected_planet=target_planet,
                        aspect_type=_aspect_type_label(planet_name, offset),
                    ))

    return aspects


def get_aspects_on_house(house_number: int,
                          planet_houses: dict[str, int]) -> list[str]:
    """Get list of planets that aspect a given house."""
    aspecting = []
    for planet_name, planet_house in planet_houses.items():
        aspected_houses = get_aspected_houses(planet_name, planet_house)
        if house_number in aspected_houses:
            aspecting.append(planet_name)
    return aspecting
