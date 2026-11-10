from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserRole:
    SUPER_ADMIN = "super_admin"
    REVIEWER = "reviewer"
    USER = "user"
    GUEST = "guest"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime, nullable=True)

    reports = relationship("IncidentReport", back_populates="reporter")

class OfficialStatistic(Base):
    __tablename__ = "official_statistics"

    id = Column(Integer, primary_key=True, index=True)
    indicator_name = Column(String(255), nullable=False)
    category = Column(String(100), index=True, nullable=False) # cybercrime, banking_fraud, upi, digital_payments
    value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False) # count, crore INR, percentage
    geography = Column(String(100), default="India (National)")
    population_coverage = Column(String(255), default="All reporting commercial banks / All States & UTs")
    period_start = Column(String(50), nullable=False) # e.g. "2023-04-01"
    period_end = Column(String(50), nullable=False) # e.g. "2024-03-31"
    publication_date = Column(String(50), nullable=False) # e.g. "2024-05-30"
    source_org = Column(String(255), nullable=False) # e.g. "Reserve Bank of India (RBI)"
    source_url = Column(String(500), nullable=False)
    metric_type = Column(String(100), nullable=False) # complaints, registered_cases, amount_involved, actual_loss, recovery
    methodology_notes = Column(Text, nullable=True)
    status = Column(String(50), default="official") # official, secondary, illustrative
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(64), unique=True, index=True, default=lambda: f"CS-{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    incident_type = Column(String(100), nullable=False) # upi_collect, qr_scam, fake_call, phishing, remote_access
    platform_used = Column(String(100), nullable=False) # whatsapp, telegram, phone, sms, fake_website
    approx_amount = Column(Float, nullable=True)
    incident_date = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="submitted") # submitted, under_review, verified_educational, closed
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reporter = relationship("User", back_populates="reports")

class CaseStudy(Base):
    __tablename__ = "case_studies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    vendor_partner = Column(String(255), nullable=True)
    reported_metrics = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    vendor_caveat = Column(Text, nullable=False)
    source_citation = Column(String(500), nullable=False)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), index=True, nullable=False)
    content = Column(Text, nullable=False)
    source_org = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=False)
    last_verified = Column(String(50), nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

