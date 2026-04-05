import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EPHE_PATH = os.path.join(os.path.dirname(BASE_DIR), "data")

# Default ayanamsa: Lahiri (Chitrapaksha) — Indian government standard
DEFAULT_AYANAMSA = "LAHIRI"

# Default house system: Whole Sign (standard for Vedic astrology)
DEFAULT_HOUSE_SYSTEM = b"W"

# Use True Node for Rahu (most common in modern Indian practice)
USE_TRUE_NODE = True
