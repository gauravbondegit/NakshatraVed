from pydantic import BaseModel


class BirthInput(BaseModel):
    name: str
    year: int
    month: int
    day: int
    hour: int
    minute: int
    second: int = 0
    place_name: str
    latitude: float | None = None
    longitude: float | None = None
    timezone: str | None = None


class PlanetPosition(BaseModel):
    name: str
    longitude: float
    latitude: float
    speed: float
    is_retrograde: bool
    rashi: str
    rashi_english: str
    rashi_index: int
    degree_in_rashi: float
    nakshatra: str
    nakshatra_pada: int
    nakshatra_lord: str
    house: int
    dignity: str


class DashaPeriod(BaseModel):
    lord: str
    start_date: str
    end_date: str
    duration_days: float
    sub_periods: list["DashaPeriod"] | None = None


class Yoga(BaseModel):
    name: str
    description: str
    involved_planets: list[str]
    is_benefic: bool


class AspectInfo(BaseModel):
    aspecting_planet: str
    aspected_planet: str
    aspect_type: str


class ChartData(BaseModel):
    chart_type: str
    planet_rashis: dict[str, int]
    ascendant_rashi: int


class KundaliResult(BaseModel):
    input: BirthInput
    ayanamsa: float
    ascendant: PlanetPosition
    planets: list[PlanetPosition]
    houses: list[float]
    charts: dict[str, ChartData]
    dashas: list[DashaPeriod]
    yogas: list[Yoga]
    aspects: list[AspectInfo]
