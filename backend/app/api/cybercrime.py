from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import OfficialStatistic, CaseStudy
from app.core.config import settings

router = APIRouter(prefix="/cybercrime", tags=["Cybercrime Intelligence"])

@router.get("/statistics")
def get_cybercrime_statistics(
    category: Optional[str] = Query(None, description="Filter by category: cybercrime, banking_fraud, digital_payments, upi"),
    metric_type: Optional[str] = Query(None, description="Filter by metric: complaints, registered_cases, amount_involved, bank_fraud_cases"),
    db: Session = Depends(get_db)
):
    query = db.query(OfficialStatistic).filter(OfficialStatistic.is_published == True)
    if category:
        query = query.filter(OfficialStatistic.category == category)
    if metric_type:
        query = query.filter(OfficialStatistic.metric_type == metric_type)

    results = query.order_by(OfficialStatistic.id.asc()).all()
    return {
        "count": len(results),
        "data": results,
        "disclaimer": settings.DISCLAIMER,
        "verified_by": {
            "owner": settings.OWNER_NAME,
            "website": settings.OWNER_WEBSITE
        }
    }

@router.get("/case-studies")
def get_case_studies(db: Session = Depends(get_db)):
    studies = db.query(CaseStudy).filter(CaseStudy.is_published == True).all()
    return {
        "count": len(studies),
        "data": studies
    }
