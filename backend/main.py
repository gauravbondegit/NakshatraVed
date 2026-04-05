"""Vedic Kundali — FastAPI application entry point."""

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router
from backend.core.ephemeris import init_ephemeris
from backend.config import EPHE_PATH

app = FastAPI(
    title="Vedic Kundali",
    description="Accurate Vedic astrology birth chart (Kundali) calculator",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Serve frontend static files
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_react_dist = os.path.join(_project_root, "frontend-react", "dist")

if os.path.exists(_react_dist):
    app.mount("/", StaticFiles(directory=_react_dist, html=True), name="frontend")


@app.on_event("startup")
def startup():
    """Initialize Swiss Ephemeris on startup."""
    init_ephemeris(EPHE_PATH)
    print(f"Swiss Ephemeris initialized with data from: {EPHE_PATH}")


@app.on_event("shutdown")
def shutdown():
    """Clean up Swiss Ephemeris on shutdown."""
    from backend.core.ephemeris import close_ephemeris
    close_ephemeris()
