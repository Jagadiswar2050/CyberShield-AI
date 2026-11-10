from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.db.models import User, UserRole, IncidentReport, OfficialStatistic, AuditLog, CaseStudy
from app.core.rbac import require_super_admin, require_reviewer_or_admin, get_current_user
from app.core.config import settings

router = APIRouter(prefix="/admin", tags=["Host / Super Admin Management"])

class StatCreateOrUpdate(BaseModel):
    indicator_name: str
    category: str
    value: float
    unit: str
    geography: str = "India (National)"
    population_coverage: str
    period_start: str
    period_end: str
    publication_date: str
    source_org: str
    source_url: str
    metric_type: str
    methodology_notes: Optional[str] = None
    status: str = "official"

class ReportStatusUpdate(BaseModel):
    status: str = Field(..., description="submitted, under_review, verified_educational, closed")
    admin_notes: Optional[str] = None

@router.get("/users", dependencies=[Depends(require_super_admin)])
def list_users(db: Session = Depends(get_db)):
    """SUPER ADMIN ONLY: View all registered users and their assigned roles."""
    users = db.query(User).order_by(User.id.asc()).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at,
            "last_login": u.last_login
        }
        for u in users
    ]

@router.post("/users/{user_id}/toggle-status", dependencies=[Depends(require_super_admin)])
def toggle_user_status(
    user_id: int,
    current_admin: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """SUPER ADMIN ONLY: Activate or deactivate a user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.email == settings.OWNER_EMAIL:
        raise HTTPException(status_code=400, detail="Cannot deactivate the Super Admin owner account.")

    user.is_active = not user.is_active
    audit = AuditLog(
        actor_email=current_admin.email,
        action="TOGGLE_USER_STATUS",
        resource_type="User",
        resource_id=str(user.id),
        details=f"Set is_active={user.is_active} for {user.email}"
    )
    db.add(audit)
    db.commit()
    return {"message": f"User {user.email} active state updated to {user.is_active}"}

@router.get("/audit-logs", dependencies=[Depends(require_super_admin)])
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    """SUPER ADMIN ONLY: View tamper-evident system audit trail."""
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/reports/all", dependencies=[Depends(require_reviewer_or_admin)])
def list_all_reports(db: Session = Depends(get_db)):
    """REVIEWER & ADMIN: View all submitted user reports for academic moderation."""
    reports = db.query(IncidentReport).order_by(IncidentReport.created_at.desc()).all()
    return reports

@router.post("/reports/{report_id}/status", dependencies=[Depends(require_reviewer_or_admin)])
def update_report_status(
    report_id: int,
    update: ReportStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """REVIEWER & ADMIN: Update status and moderation notes on a user report."""
    report = db.query(IncidentReport).filter(IncidentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    report.status = update.status
    if update.admin_notes:
        report.admin_notes = update.admin_notes

    audit = AuditLog(
        actor_email=current_user.email,
        action="UPDATE_REPORT_STATUS",
        resource_type="IncidentReport",
        resource_id=str(report.id),
        details=f"Updated report status to {update.status} (Notes: {update.admin_notes})"
    )
    db.add(audit)
    db.commit()
    return {"message": "Report status updated successfully"}

@router.post("/statistics", dependencies=[Depends(require_super_admin)])
def create_or_update_statistic(
    stat_in: StatCreateOrUpdate,
    current_admin: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """SUPER ADMIN ONLY: Publish or update official statistics with source provenance."""
    stat = OfficialStatistic(**stat_in.model_dump())
    db.add(stat)
    db.commit()
    db.refresh(stat)

    audit = AuditLog(
        actor_email=current_admin.email,
        action="CREATE_STATISTIC",
        resource_type="OfficialStatistic",
        resource_id=str(stat.id),
        details=f"Added statistic: {stat.indicator_name} ({stat.source_org})"
    )
    db.add(audit)
    db.commit()
    return stat

@router.get("/system-health", dependencies=[Depends(require_reviewer_or_admin)])
def get_system_health(db: Session = Depends(get_db)):
    """System overview and telemetry."""
    user_count = db.query(func.count(User.id)).scalar()
    report_count = db.query(func.count(IncidentReport.id)).scalar()
    stat_count = db.query(func.count(OfficialStatistic.id)).scalar()
    audit_count = db.query(func.count(AuditLog.id)).scalar()

    return {
        "status": "OPERATIONAL",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "owner": settings.OWNER_NAME,
        "owner_website": settings.OWNER_WEBSITE,
        "super_admin_email": settings.OWNER_EMAIL,
        "database": "Active (SQLite/SQLAlchemy)",
        "telemetry": {
            "total_users": user_count,
            "total_reports": report_count,
            "official_statistics_published": stat_count,
            "audit_trail_events": audit_count
        }
    }

