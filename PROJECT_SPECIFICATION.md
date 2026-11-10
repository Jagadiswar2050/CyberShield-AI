# CyberShield AI — Project Specification

## Objective
Create an independent educational cybercrime intelligence portal combining financial forecasting, transaction-fraud detection demonstrations, public cyber-safety education and host-managed content.

## User stories
### Guest
- Browse public dashboard, history, case studies and prevention resources.
- See the source and reporting period behind every published statistic.
- Use a clearly labelled synthetic transaction demo.

### Registered user
- Sign in securely.
- Submit a cyber-fraud learning/report form without sharing PINs, OTPs or passwords.
- Track only their own submissions.
- Use the AI assistant for educational information.

### Reviewer (optional)
- Read-only access to approved project dashboards and reports.
- No content publishing, user administration or system configuration.

### Super Admin / Host
- Owner: Thallapaka Jagadiswar.
- Email: jagadishkrishna7@gmail.com.
- Website: https://www.audit3a.com/
- Manage users and reviewer access.
- Create/edit/publish content and statistics.
- Manage data source metadata and uploads.
- View audit logs and system health.
- Manage AI knowledge-base documents and demo settings.

## Core dashboard measures
- Cybercrime complaints (not equivalent to registered cases).
- Bank fraud cases (with threshold and scope stated).
- Amount involved (not necessarily actual loss).
- Actual reported loss and recovery only where source definitions support them.
- Fraud category breakdown and time trend.
- State-wise figures only when official source supports the geography and period.

## Main ML features
- Transaction amount deviation from customer baseline.
- Transaction velocity.
- New or unrecognised device indicator.
- Unusual location indicator.
- Time-of-day deviation.
- Model explanation / reason codes.
- Precision, recall, F1, PR-AUC and false-positive rate.

## Key screens
1. Landing page
2. Cybercrime overview
3. Banking fraud analytics
4. UPI fraud education
5. History timeline
6. Case studies
7. Fraud simulator
8. Financial forecast demo
9. AI assistant
10. User login/register
11. User dashboard/report status
12. Admin dashboard
13. Admin content editor
14. Admin data/source manager
15. Admin user management
16. Audit log
17. About/methodology/privacy/contact

## Definition of done
- No admin action is possible through a user account.
- Admin authorization is enforced on the server and database.
- No secret is committed to source control.
- Synthetic data is clearly labelled.
- Every public statistic includes source, period and definition.
- No invented live bank connection or official affiliation.
- App runs locally from documented steps.
- Tests cover unauthorised admin access and user data isolation.
