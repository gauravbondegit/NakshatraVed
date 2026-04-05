"""FastAPI routes for Kundali calculation API."""

from fastapi import APIRouter, HTTPException
from backend.core.models import BirthInput, KundaliResult
from backend.core.ephemeris import datetime_to_jd, get_ayanamsa
from backend.core.calculations import compute_full_chart
from backend.core.divisional_charts import compute_all_divisional_charts
from backend.core.dasha import compute_full_dasha_tree
from backend.core.aspects import compute_aspect_table
from backend.core.yogas import detect_all_yogas
from backend.core.strength import compute_strength_summary
from backend.api.geocoding import resolve_location, geocode_place, geocode_suggestions, get_timezone

router = APIRouter(prefix="/api")


@router.post("/calculate", response_model=KundaliResult)
async def calculate_kundali(birth: BirthInput):
    """Calculate complete Vedic kundali from birth details."""
    try:
        # Resolve location
        lat, lon, timezone, utc_offset = resolve_location(
            birth.place_name, birth.latitude, birth.longitude,
            birth.timezone,
            birth.year, birth.month, birth.day,
            birth.hour, birth.minute,
        )

        # Update birth input with resolved values
        birth.latitude = lat
        birth.longitude = lon
        birth.timezone = timezone

        # Convert to Julian Day
        jd_ut = datetime_to_jd(
            birth.year, birth.month, birth.day,
            birth.hour, birth.minute, birth.second,
            utc_offset,
        )

        # Core chart calculation
        chart_data = compute_full_chart(jd_ut, lat, lon)
        planets = chart_data["planets"]
        ascendant = chart_data["ascendant"]

        # Divisional charts
        charts = compute_all_divisional_charts(planets, ascendant.longitude)

        # Vimshottari Dasha
        moon = next(p for p in planets if p.name == "Moon")
        dashas = compute_full_dasha_tree(moon.longitude, jd_ut)

        # Aspects
        planet_houses = {p.name: p.house for p in planets}
        aspects = compute_aspect_table(planet_houses)

        # Yogas
        yogas = detect_all_yogas(planets, ascendant.rashi_index)

        # Strength summary (attached to response as extra data)
        strength = compute_strength_summary(planets)

        return KundaliResult(
            input=birth,
            ayanamsa=chart_data["ayanamsa"],
            ascendant=ascendant,
            planets=planets,
            houses=chart_data["houses"],
            charts=charts,
            dashas=dashas,
            yogas=yogas,
            aspects=aspects,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@router.get("/geocode")
async def geocode(place: str):
    try:
        geo = geocode_place(place)
        tz = get_timezone(geo["latitude"], geo["longitude"])
        return {
            "latitude": geo["latitude"],
            "longitude": geo["longitude"],
            "display_name": geo["display_name"],
            "timezone": tz,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/geocode/suggest")
async def geocode_suggest(q: str):
    try:
        return geocode_suggestions(q, limit=5)
    except Exception:
        return []


@router.get("/health")
async def health():
    """Health check — verifies ephemeris is loaded."""
    from backend.core.ephemeris import get_ayanamsa, datetime_to_jd
    jd = datetime_to_jd(2000, 1, 1, 0, 0, 0, 0.0)
    ayanamsa = get_ayanamsa(jd)
    return {
        "status": "ok",
        "ayanamsa_j2000": round(ayanamsa, 4),
        "message": "Vedic Kundali API is running",
    }
