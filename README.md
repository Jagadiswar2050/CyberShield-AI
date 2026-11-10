# CyberShield AI — Antigravity Project Handoff

This package is a project brief and build prompt for Google Antigravity. It is **not** a completed or deployed website.

## Contents
- `ANTIGRAVITY_BUILD_PROMPT.md` — paste this into Antigravity as the primary build instruction.
- `PROJECT_SPECIFICATION.md` — scope, pages, roles, architecture, safety and acceptance criteria.
- `DATA_AND_SOURCES.md` — guidance for official cybercrime/banking statistics and source handling.
- `reference/AI_Financial_Prediction_Fraud_Detection_15_Slides.pdf` — the user's original presentation.

## Project owner / intended host
- Name: Thallapaka Jagadiswar
- Email: jagadishkrishna7@gmail.com
- Intended role: Super Admin / Host

Do not put passwords, API keys, service-role keys, or other secrets in frontend code or this package. Configure the owner account securely through the authentication provider and server-side role assignment.

## Suggested Antigravity workflow
1. Open Antigravity and create a new web application project.
2. Add this ZIP's extracted folder as project context (or extract it and open the folder).
3. Paste `ANTIGRAVITY_BUILD_PROMPT.md` into the agent.
4. Ask it to implement in phases: UI, backend/auth, data ingestion, ML demo, AI assistant, testing, deployment.
5. Review generated code, environment variables, database policies, and authentication before deployment.

## Important limitations
- No live bank transaction feed is included.
- No official government or bank integration is included.
- Demo transaction records and simulator scores must be labelled synthetic/illustrative.
- Published statistics must show source, reporting period, publication date, and definition.
- This package does not create a domain, hosting account, or deployed admin URL.
