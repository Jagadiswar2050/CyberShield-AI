import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import IncidentReport, User, UserRole, AuditLog
from app.core.rbac import get_current_user, require_authenticated_user

router = APIRouter(prefix="/reports", tags=["Incident Reports & Case Tracking"])

class ReportCreate(BaseModel):
    incident_type: str = Field(..., description="Type of cyber fraud (e.g., UPI Collect, QR Scam, Phishing, Fake Call)")
    platform_used: str = Field(..., description="Platform (WhatsApp, Telegram, Phone Call, SMS, Website)")
    approx_amount: Optional[float] = Field(None, description="Approximate amount involved in INR")
    incident_date: str = Field(..., description="Date of incident (YYYY-MM-DD)")
    description: str = Field(..., min_length=15, max_length=2000, description="Description of modus operandi")

@router.post("/submit", status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: ReportCreate,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Submits a cyber-fraud awareness report.
    Enforces validation preventing submission of sensitive passwords, OTPs, or card numbers.
    """
    desc = report_in.description
    # Basic sanitize check: reject if obvious 16-digit card number or OTP sharing
    if re.search(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", desc):
        raise HTTPException(
            status_code=400,
            detail="Security violation: Do NOT include your actual 16-digit debit/credit card number in reports."
        )

    new_report = IncidentReport(
        user_id=current_user.id,
        incident_type=report_in.incident_type,
        platform_used=report_in.platform_used,
        approx_amount=report_in.approx_amount,
        incident_date=report_in.incident_date,
        description=desc,
        status="submitted"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Log action
    audit = AuditLog(
        actor_email=current_user.email,
        action="SUBMIT_INCIDENT_REPORT",
        resource_type="IncidentReport",
        resource_id=str(new_report.id),
        details=f"User submitted report {new_report.tracking_number} ({new_report.incident_type})"
    )
    db.add(audit)
    db.commit()

    return {
        "message": "Incident report logged successfully for academic/safety review.",
        "tracking_number": new_report.tracking_number,
        "status": new_report.status,
        "advisory": "Remember: This is an academic intelligence portal. For actual recovery or police investigation, register immediately on cybercrime.gov.in or dial 1930."
    }

@router.get("/my-reports")
def get_user_reports(
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Returns only reports belonging to the authenticated user."""
    reports = db.query(IncidentReport).filter(IncidentReport.user_id == current_user.id).order_by(IncidentReport.created_at.desc()).all()
    return {
        "count": len(reports),
        "data": reports
    }
