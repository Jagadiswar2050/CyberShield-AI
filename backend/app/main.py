from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.seed_data import seed_database
from app.api import auth, cybercrime, ml_simulator, financial_forecast, ai_assistant, reports, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Seed initial data & Super Admin account
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Financial Prediction, Fraud Detection & Cybercrime Intelligence Portal",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware (allowing development frontends)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to configured domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(cybercrime.router, prefix=settings.API_V1_PREFIX)
app.include_router(ml_simulator.router, prefix=settings.API_V1_PREFIX)
app.include_router(financial_forecast.router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_assistant.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "academic_context": "B.Tech Computer Science & Technology Major Project",
        "creator": {
            "name": settings.OWNER_NAME,
            "email": settings.OWNER_EMAIL,
            "website": settings.OWNER_WEBSITE
        },
        "docs_url": "/docs",
        "disclaimer": settings.DISCLAIMER,
        "emergency_reporting": {
            "national_helpline": settings.CYBER_EMERGENCY_HELPLINE,
            "national_portal": settings.CYBER_PORTAL_URL
        }
    }
