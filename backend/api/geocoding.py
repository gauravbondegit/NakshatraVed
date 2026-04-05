"""Geocoding and timezone resolution.

Uses Nominatim (OpenStreetMap) for geocoding and timezonefinder for timezone.
"""

from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime

_geolocator = Nominatim(user_agent="vedic-kundali-app")
_tf = TimezoneFinder()


def geocode_suggestions(query: str, limit: int = 5) -> list[dict]:
    results = _geolocator.geocode(query, exactly_one=False, limit=limit)
    if not results:
        return []
    return [
        {
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "display_name": loc.address,
        }
        for loc in results
    ]


def geocode_place(place_name: str) -> dict:
    """Resolve a place name to coordinates.

    Returns: {"latitude": float, "longitude": float, "display_name": str}
    """
    location = _geolocator.geocode(place_name)
    if location is None:
        raise ValueError(f"Could not find location: {place_name}")
    return {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "display_name": location.address,
    }


def get_timezone(lat: float, lon: float) -> str:
    """Get IANA timezone string from coordinates."""
    tz_str = _tf.timezone_at(lng=lon, lat=lat)
    if tz_str is None:
        raise ValueError(f"Could not determine timezone for ({lat}, {lon})")
    return tz_str


def get_utc_offset(timezone_str: str, year: int, month: int, day: int,
                    hour: int, minute: int) -> float:
    """Get UTC offset in hours for a given local datetime and timezone.

    Handles DST transitions correctly.
    """
    tz = pytz.timezone(timezone_str)
    local_dt = datetime(year, month, day, hour, minute)
    localized = tz.localize(local_dt, is_dst=None)
    offset = localized.utcoffset()
    return offset.total_seconds() / 3600.0


def resolve_location(place_name: str, lat: float | None, lon: float | None,
                      timezone: str | None,
                      year: int, month: int, day: int,
                      hour: int, minute: int) -> tuple[float, float, str, float]:
    """Resolve full location info: lat, lon, timezone, utc_offset.

    If lat/lon not provided, geocodes from place_name.
    If timezone not provided, determines from coordinates.
    """
    if lat is None or lon is None:
        geo = geocode_place(place_name)
        lat = geo["latitude"]
        lon = geo["longitude"]

    if timezone is None:
        timezone = get_timezone(lat, lon)

    utc_offset = get_utc_offset(timezone, year, month, day, hour, minute)

    return lat, lon, timezone, utc_offset
