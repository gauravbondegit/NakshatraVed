"""Yoga detection — key planetary combinations in Vedic astrology.

Implements: Panch Mahapurusha Yogas, Gajakesari, Budhaditya, Chandra-Mangal,
Raja Yogas, Dhana Yogas, Viparita Raja Yoga, Kemadruma, Manglik Dosha.
"""

from backend.core.models import Yoga, PlanetPosition
from backend.core.calculations import RASHI_LORDS

KENDRA_HOUSES = {1, 4, 7, 10}
TRIKONA_HOUSES = {1, 5, 9}
DUSTHANA_HOUSES = {6, 8, 12}


def _planet_dict(planets: list[PlanetPosition]) -> dict[str, PlanetPosition]:
    return {p.name: p for p in planets}


def _check_ruchaka(planets: dict) -> Yoga | None:
    """Ruchaka Yoga: Mars in kendra in Mesha/Vrischika/Makara."""
    mars = planets.get("Mars")
    if mars and mars.house in KENDRA_HOUSES and mars.rashi_index in (0, 7, 9):
        return Yoga(
            name="Ruchaka Yoga",
            description="Mars in kendra in own/exalted sign. Gives courage, leadership, and physical strength.",
            involved_planets=["Mars"],
            is_benefic=True,
        )
    return None


def _check_bhadra(planets: dict) -> Yoga | None:
    """Bhadra Yoga: Mercury in kendra in Mithuna/Kanya."""
    mercury = planets.get("Mercury")
    if mercury and mercury.house in KENDRA_HOUSES and mercury.rashi_index in (2, 5):
        return Yoga(
            name="Bhadra Yoga",
            description="Mercury in kendra in own/exalted sign. Gives intelligence, eloquence, and learning.",
            involved_planets=["Mercury"],
            is_benefic=True,
        )
    return None


def _check_hamsa(planets: dict) -> Yoga | None:
    """Hamsa Yoga: Jupiter in kendra in Dhanu/Meena/Karka."""
    jupiter = planets.get("Jupiter")
    if jupiter and jupiter.house in KENDRA_HOUSES and jupiter.rashi_index in (8, 11, 3):
        return Yoga(
            name="Hamsa Yoga",
            description="Jupiter in kendra in own/exalted sign. Gives wisdom, righteousness, and spiritual inclination.",
            involved_planets=["Jupiter"],
            is_benefic=True,
        )
    return None


def _check_malavya(planets: dict) -> Yoga | None:
    """Malavya Yoga: Venus in kendra in Vrishabha/Tula/Meena."""
    venus = planets.get("Venus")
    if venus and venus.house in KENDRA_HOUSES and venus.rashi_index in (1, 6, 11):
        return Yoga(
            name="Malavya Yoga",
            description="Venus in kendra in own/exalted sign. Gives luxury, beauty, artistic talent, and comfort.",
            involved_planets=["Venus"],
            is_benefic=True,
        )
    return None


def _check_shasha(planets: dict) -> Yoga | None:
    """Shasha Yoga: Saturn in kendra in Makara/Kumbha/Tula."""
    saturn = planets.get("Saturn")
    if saturn and saturn.house in KENDRA_HOUSES and saturn.rashi_index in (9, 10, 6):
        return Yoga(
            name="Shasha Yoga",
            description="Saturn in kendra in own/exalted sign. Gives authority, discipline, and administrative power.",
            involved_planets=["Saturn"],
            is_benefic=True,
        )
    return None


def _check_gajakesari(planets: dict) -> Yoga | None:
    """Gajakesari Yoga: Jupiter in kendra from Moon."""
    moon = planets.get("Moon")
    jupiter = planets.get("Jupiter")
    if moon and jupiter:
        distance = ((jupiter.house - moon.house) % 12)
        if distance in (0, 3, 6, 9):  # 1st, 4th, 7th, 10th from Moon
            return Yoga(
                name="Gajakesari Yoga",
                description="Jupiter in kendra from Moon. Gives fame, prosperity, intelligence, and lasting reputation.",
                involved_planets=["Moon", "Jupiter"],
                is_benefic=True,
            )
    return None


def _check_budhaditya(planets: dict) -> Yoga | None:
    """Budhaditya Yoga: Sun-Mercury conjunction (same house)."""
    sun = planets.get("Sun")
    mercury = planets.get("Mercury")
    if sun and mercury and sun.house == mercury.house:
        # Mercury should not be combust (within ~14° of Sun)
        angular_diff = abs(sun.longitude - mercury.longitude)
        if angular_diff > 180:
            angular_diff = 360 - angular_diff
        if angular_diff > 14:  # Not combust — stronger yoga
            return Yoga(
                name="Budhaditya Yoga",
                description="Sun-Mercury conjunction (uncombust). Gives sharp intellect, education, and fame through knowledge.",
                involved_planets=["Sun", "Mercury"],
                is_benefic=True,
            )
        else:
            return Yoga(
                name="Budhaditya Yoga (weak)",
                description="Sun-Mercury conjunction (Mercury combust). Mild benefits to intellect and learning.",
                involved_planets=["Sun", "Mercury"],
                is_benefic=True,
            )
    return None


def _check_chandra_mangal(planets: dict) -> Yoga | None:
    """Chandra-Mangal Yoga: Moon-Mars conjunction."""
    moon = planets.get("Moon")
    mars = planets.get("Mars")
    if moon and mars and moon.house == mars.house:
        return Yoga(
            name="Chandra-Mangal Yoga",
            description="Moon-Mars conjunction. Gives wealth through self-effort, entrepreneurial ability.",
            involved_planets=["Moon", "Mars"],
            is_benefic=True,
        )
    return None


def _check_kemadruma(planets: dict) -> Yoga | None:
    """Kemadruma Yoga: No planet in 2nd or 12th from Moon (inauspicious)."""
    moon = planets.get("Moon")
    if not moon:
        return None

    house_2nd = (moon.house % 12) + 1
    house_12th = ((moon.house - 2) % 12) + 1

    for name, p in planets.items():
        if name == "Moon":
            continue
        if name in ("Rahu", "Ketu"):
            continue  # Shadow planets don't cancel Kemadruma
        if p.house == house_2nd or p.house == house_12th:
            return None  # Yoga cancelled

    return Yoga(
        name="Kemadruma Yoga",
        description="No planet in 2nd or 12th from Moon. Can indicate periods of loneliness, financial difficulty, or emotional struggle.",
        involved_planets=["Moon"],
        is_benefic=False,
    )


def _check_manglik(planets: dict) -> Yoga | None:
    """Manglik Dosha: Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna."""
    mars = planets.get("Mars")
    if mars and mars.house in (1, 2, 4, 7, 8, 12):
        return Yoga(
            name="Manglik Dosha (Kuja Dosha)",
            description=f"Mars in house {mars.house} from Lagna. Important consideration for marriage compatibility.",
            involved_planets=["Mars"],
            is_benefic=False,
        )
    return None


def _check_raja_yogas(planets: dict, asc_rashi_index: int) -> list[Yoga]:
    """Raja Yoga: Lords of kendras and trikonas conjoined or in each other's houses."""
    yogas = []

    # Get lords of kendra and trikona houses
    kendra_lords = set()
    trikona_lords = set()

    for house in KENDRA_HOUSES:
        rashi_idx = (asc_rashi_index + house - 1) % 12
        kendra_lords.add(RASHI_LORDS[rashi_idx])

    for house in TRIKONA_HOUSES:
        rashi_idx = (asc_rashi_index + house - 1) % 12
        trikona_lords.add(RASHI_LORDS[rashi_idx])

    # Check for conjunction of kendra and trikona lords
    for kl in kendra_lords:
        for tl in trikona_lords:
            if kl == tl:
                continue  # Same planet can't form yoga with itself
            k_planet = planets.get(kl)
            t_planet = planets.get(tl)
            if k_planet and t_planet and k_planet.house == t_planet.house:
                yogas.append(Yoga(
                    name="Raja Yoga",
                    description=f"Kendra lord ({kl}) conjoined with Trikona lord ({tl}) in house {k_planet.house}. Indicates power, status, and success.",
                    involved_planets=[kl, tl],
                    is_benefic=True,
                ))

    return yogas


def _check_viparita_raja(planets: dict, asc_rashi_index: int) -> Yoga | None:
    """Viparita Raja Yoga: Lords of 6, 8, 12 placed in 6, 8, or 12."""
    dusthana_lord_houses = []
    for house in (6, 8, 12):
        rashi_idx = (asc_rashi_index + house - 1) % 12
        lord = RASHI_LORDS[rashi_idx]
        p = planets.get(lord)
        if p and p.house in DUSTHANA_HOUSES:
            dusthana_lord_houses.append(lord)

    if len(dusthana_lord_houses) >= 2:
        return Yoga(
            name="Viparita Raja Yoga",
            description=f"Dusthana lords ({', '.join(dusthana_lord_houses)}) placed in dusthana houses. Unexpected rise through adversity.",
            involved_planets=dusthana_lord_houses,
            is_benefic=True,
        )
    return None


def detect_all_yogas(planets: list[PlanetPosition],
                      asc_rashi_index: int) -> list[Yoga]:
    """Run all yoga checks and return detected yogas."""
    pd = _planet_dict(planets)
    detected = []

    # Panch Mahapurusha Yogas
    for check in [_check_ruchaka, _check_bhadra, _check_hamsa,
                  _check_malavya, _check_shasha]:
        yoga = check(pd)
        if yoga:
            detected.append(yoga)

    # Other important yogas
    for check in [_check_gajakesari, _check_budhaditya,
                  _check_chandra_mangal, _check_kemadruma, _check_manglik]:
        yoga = check(pd)
        if yoga:
            detected.append(yoga)

    # Raja Yogas (can produce multiple)
    detected.extend(_check_raja_yogas(pd, asc_rashi_index))

    # Viparita Raja Yoga
    yoga = _check_viparita_raja(pd, asc_rashi_index)
    if yoga:
        detected.append(yoga)

    return detected
