import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CyberShield AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Project Identity & Owner
    OWNER_NAME: str = "Thallapaka Jagadiswar"
    OWNER_EMAIL: str = "jagadishkrishna7@gmail.com"
    OWNER_WEBSITE: str = "https://www.audit3a.com/"
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cybershield-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cybershield.db")
    
    # Official National Cyber Crime Emergency Details
    CYBER_EMERGENCY_HELPLINE: str = "1930"
    CYBER_PORTAL_URL: str = "https://cybercrime.gov.in/"
    
    # Public Disclaimer
    DISCLAIMER: str = (
        "CyberShield AI is an independent academic, research, and public-awareness platform created by "
        "Thallapaka Jagadiswar (Audit3A). It is NOT affiliated with, nor does it impersonate, any police "
        "department, government agency, regulator (such as RBI/MHA), or commercial banking institution. "
        "For actual ongoing cyber fraud, immediately dial 1930 or visit cybercrime.gov.in."
    )

settings = Settings()
