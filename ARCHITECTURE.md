# CyberShield AI — Architecture & System Design Document

**Academic Context:** B.Tech Computer Science & Technology Major Project  
**Project Owner / Intended Host Super Admin:** Thallapaka Jagadiswar  
**Owner Email:** jagadishkrishna7@gmail.com  
**Owner Portfolio & Website:** [https://www.audit3a.com/](https://www.audit3a.com/)  

---

## 1. System Topology & Component Overview

```
                                  +------------------------------------+
                                  |   Public Visitors & Registered     |
                                  |         (Browser / Mobile)         |
                                  +-----------------+------------------+
                                                    |
                                           HTTPS / REST API
                                                    v
+----------------------------------------------------------------------------------------------------+
|  FRONTEND LAYER (React 18 + TypeScript + Vite + Tailwind CSS + Recharts)                           |
|  - Theme: Charcoal command-center (#05080E) with metallic gold (#D4AF37) and amber accents        |
|  - 14 Dedicated Modules: Landing, Intelligence, Banking Fraud, UPI Safety, Timeline, Case Studies, |
|    ML Simulator, Time-Series Forecast, AI Assistant, Report Submissions, User Portal, Host Admin   |
|  - Creator Attribution & Direct Integration to Audit3A (https://www.audit3a.com/)                  |
+----------------------------------------------------------------------------------------------------+
                                                    |
                                    Reverse Proxy / CORS / JWT Auth
                                                    v
+----------------------------------------------------------------------------------------------------+
|  BACKEND APPLICATION LAYER (Python FastAPI + Pydantic v2 + Uvicorn)                                |
|  - Server-Side RBAC Enforcement: (super_admin, reviewer, user, guest)                              |
|  - RESTful Endpoints: /api/v1/auth, /cybercrime, /simulator, /forecast, /assistant, /admin        |
+-------------------+-------------------------------+----------------------------+---------------+
                    |                               |                            |
                    v                               v                            v
   +-------------------------------+  +--------------------------+  +-------------------------------+
   |   DATA & PERSISTENCE LAYER    |  |  ML FRAUD SCORING ENGINE |  |   RAG KNOWLEDGE CORE          |
   | - SQLAlchemy 2.0 ORM          |  | - Calibrated Ensemble ML |  | - Verified Safety Directives  |
   | - SQLite / PostgreSQL         |  | - Heuristic Baseline     |  | - National Emergency Referral |
   | - Models: Users, Statistics,  |  | - SHAP-style Reason Code |  |   (Helpline 1930 & Portal)    |
   |   IncidentReports, CaseStudy, |  | - ₹78k Tirupati Scenario |  | - Strict Anti-OTP Guardrails  |
   |   AuditLogs                   |  | - Precision/Recall/F1    |  | - Creator attribution link    |
   +-------------------------------+  +--------------------------+  +-------------------------------+
```

---

## 2. Server-Enforced Role-Based Access Control (RBAC)

The system strictly enforces permissions on the server to prevent privilege escalation:
- **`super_admin`**: Assigned strictly to `jagadishkrishna7@gmail.com` via seed script or server-side migration. Public registration never allows selecting this role.
- **`reviewer`**: Read-only academic auditor role created exclusively by the Super Admin.
- **`user`**: Default role for all public registrants. Permitted to use simulators, chat with assistant, submit incident awareness reports, and view only their own submissions.
- **`guest`**: Unauthenticated public visitor with read access to official statistics, educational materials, and simulator demos.

---

## 3. Data Integrity & Sourced Metrics Policy

Official Indian financial and cybercrime metrics are stored with metadata:
- **Indicator Name & Value**
- **Geography & Population Coverage**
- **Reporting Period Start & End**
- **Publication Date**
- **Source Agency (RBI, NCRB, I4C)**
- **Direct Source URL**
- **Methodology & Scope Distinction**: Distinguishes formal police FIRs from citizen helpline complaints, and initial amount involved from actual net unrecovered financial loss.
- **Demo Data Tag**: All simulation models display `SYNTHETIC DEMO DATA — NOT LIVE BANK DATA`.
