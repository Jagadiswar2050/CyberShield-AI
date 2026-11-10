from sqlalchemy.orm import Session
from app.db.models import User, UserRole, OfficialStatistic, CaseStudy, KnowledgeDocument, AuditLog
from app.core.security import hash_password
from app.core.config import settings

def seed_database(db: Session):
    """Populates database with official statistics, case studies, knowledge base, and super admin."""

    # 1. Super Admin Account
    existing_admin = db.query(User).filter(User.email == settings.OWNER_EMAIL).first()
    if not existing_admin:
        admin_user = User(
            email=settings.OWNER_EMAIL,
            full_name=settings.OWNER_NAME,
            hashed_password=hash_password("Admin@CyberShield2026!"), # default initial password; change in production
            role=UserRole.SUPER_ADMIN,
            is_active=True
        )
        db.add(admin_user)
        db.flush()

        # Add audit log
        audit = AuditLog(
            actor_email="system@cybershield.local",
            action="SEED_SUPER_ADMIN",
            resource_type="User",
            resource_id=str(admin_user.id),
            details=f"Provisioned Super Admin role to project owner: {settings.OWNER_NAME} ({settings.OWNER_EMAIL})"
        )
        db.add(audit)

    # 2. Official Sourced Statistics
    stats_data = [
        {
            "indicator_name": "Scheduled Commercial Banks - Total Fraud Cases Reported",
            "category": "banking_fraud",
            "value": 36075.0,
            "unit": "Cases",
            "geography": "India (All SCBs)",
            "population_coverage": "Public, Private, and Foreign Scheduled Commercial Banks",
            "period_start": "2023-04-01",
            "period_end": "2024-03-31",
            "publication_date": "2024-05-30",
            "source_org": "Reserve Bank of India (RBI)",
            "source_url": "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Report%20on%20Trend%20and%20Progress%20of%20Banking%20in%20India",
            "metric_type": "bank_fraud_cases",
            "methodology_notes": "Cases involving amounts of ₹1 lakh and above reported by banks. Increase was largely driven by small-value digital payments/card frauds.",
            "status": "official"
        },
        {
            "indicator_name": "Scheduled Commercial Banks - Total Amount Involved in Fraud",
            "category": "banking_fraud",
            "value": 21469.0,
            "unit": "Crore INR",
            "geography": "India (All SCBs)",
            "population_coverage": "Scheduled Commercial Banks",
            "period_start": "2023-04-01",
            "period_end": "2024-03-31",
            "publication_date": "2024-05-30",
            "source_org": "Reserve Bank of India (RBI)",
            "source_url": "https://www.rbi.org.in/",
            "metric_type": "amount_involved",
            "methodology_notes": "CRITICAL SCOPE NOTE: 'Amount involved' reflects exposure stated at registration, NOT actual unrecovered permanent loss. Large loan defaults comprise ~67% of total amount.",
            "status": "official"
        },
        {
            "indicator_name": "Digital Payment & Card Fraud Cases Reported to RBI",
            "category": "digital_payments",
            "value": 29082.0,
            "unit": "Cases",
            "geography": "India (All SCBs)",
            "population_coverage": "Internet banking, card payments, mobile banking",
            "period_start": "2023-04-01",
            "period_end": "2024-03-31",
            "publication_date": "2024-05-30",
            "source_org": "Reserve Bank of India (RBI)",
            "source_url": "https://www.rbi.org.in/",
            "metric_type": "bank_fraud_cases",
            "methodology_notes": "Represents 80.6% of all bank fraud cases by volume, but only 6.7% of total financial amount (avg loss per card/internet fraud is much smaller than loan frauds).",
            "status": "official"
        },
        {
            "indicator_name": "Total Cybercrime Registered Cases (NCRB)",
            "category": "cybercrime",
            "value": 65893.0,
            "unit": "Registered FIRs",
            "geography": "All 28 States & 8 UTs (India)",
            "population_coverage": "Police Stations reporting under Crime in India",
            "period_start": "2022-01-01",
            "period_end": "2022-12-31",
            "publication_date": "2023-12-03",
            "source_org": "National Crime Records Bureau (NCRB)",
            "source_url": "https://ncrb.gov.in/crime-in-india.html",
            "metric_type": "registered_cases",
            "methodology_notes": "Registered First Information Reports (FIRs). 67.5% had fraud as primary stated motive.",
            "status": "official"
        },
        {
            "indicator_name": "National Cyber Crime 1930 Helpline Complaints Processed",
            "category": "cybercrime",
            "value": 1120000.0,
            "unit": "Complaints",
            "geography": "India (Pan-India)",
            "population_coverage": "Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)",
            "period_start": "2023-01-01",
            "period_end": "2023-12-31",
            "publication_date": "2024-02-06",
            "source_org": "Indian Cyber Crime Coordination Centre (I4C), MHA",
            "source_url": "https://i4c.mha.gov.in/",
            "metric_type": "complaints",
            "methodology_notes": "Complaints received via 1930 and online portal. Over ₹1,200 Crore provisionally saved/put on lien by banking system.",
            "status": "official"
        }
    ]

    for stat in stats_data:
        existing = db.query(OfficialStatistic).filter(OfficialStatistic.indicator_name == stat["indicator_name"]).first()
        if not existing:
            db.add(OfficialStatistic(**stat))

    # 3. Case Studies
    case_studies = [
        {
            "title": "Yapı Kredi Real-Time Adaptive Fraud Scoring Implementation",
            "organization": "Yapı Kredi Bank (Turkey)",
            "vendor_partner": "FICO (Fair Isaac Corporation)",
            "reported_metrics": "Vendor-reported 40% reduction in card fraud losses; 60% acceleration in investigation cycle.",
            "summary": (
                "Yapı Kredi integrated real-time machine learning fraud analytics into its core authorization engine "
                "to evaluate card-not-present (CNP) and mobile banking transactions. By analyzing streaming transaction "
                "telemetry, device fingerprints, and customer behavioral baselines, suspicious transactions triggered "
                "instant step-up authentication instead of outright declines, preserving legitimate customer experience."
            ),
            "vendor_caveat": (
                "IMPORTANT METHODOLOGY CAVEAT: This case study is based on a FICO vendor press release dated 30 January 2025. "
                "It represents vendor-reported metrics and operational claims, NOT an independent double-blind causal academic evaluation. "
                "Results depend on bank-specific customer demographics, existing fraud controls, and rule tuning."
            ),
            "source_citation": "FICO Customer Success Announcement (30 Jan 2025) / Yapı Kredi Technology Brief."
        }
    ]

    for cs in case_studies:
        existing_cs = db.query(CaseStudy).filter(CaseStudy.title == cs["title"]).first()
        if not existing_cs:
            db.add(CaseStudy(**cs))

    db.commit()

