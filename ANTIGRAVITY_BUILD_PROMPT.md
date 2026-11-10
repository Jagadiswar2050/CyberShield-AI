# PRIMARY BUILD PROMPT — CYBERSHIELD AI

Build a complete, polished, responsive, secure full-stack web application named **CyberShield AI**.

## Project identity
**Title:** AI-Powered Financial Prediction, Fraud Detection & Cybercrime Intelligence Portal  
**Academic context:** B.Tech Computer Science & Technology major project  
**Owner / intended host Super Admin:** Thallapaka Jagadiswar  
**Owner email:** jagadishkrishna7@gmail.com  
**Owner website:** [https://www.audit3a.com/](https://www.audit3a.com/)

The site is an independent academic and public-awareness platform. Do not impersonate a government agency, police department, regulator, or bank. Display a clear disclaimer that it is an independent educational/research project.

## Design direction
Create a premium cybersecurity command-centre aesthetic:
- Deep charcoal / near-black backgrounds.
- Metallic and magic gold accents.
- Restrained amber fire glow, subtle lightning/thunder motifs, fine particle effects.
- High contrast, accessible typography and responsive layouts.
- Professional banking/cybersecurity visual language; avoid clutter and excessive animation.
- Use a cohesive design system, reusable components, loading states, empty states, validation and error states.
- Make mobile, tablet and desktop layouts work.

## Required application areas
1. Public landing page: project mission, key capabilities, clear navigation and disclaimers.
2. Cybercrime intelligence dashboard: official published data visualisations, filters by year/state/category where supported, source notes and last-updated timestamps.
3. Banking fraud dashboard: reported cases, amount involved, fraud categories and trends. Explain the scope and definitions of each metric.
4. UPI fraud learning centre: collect-request scams, QR-code scams, fake customer care, phishing, screen-sharing/remote-access abuse, OTP/PIN social engineering and prevention guidance.
5. Fraud history timeline: manual review (1950s–1980s), rule-based monitoring (1980s–1990s), chip cards/online commerce (1990s–2000s), machine learning at scale (2010s), real-time AI/graph/device signals (2020s onward), following the supplied presentation's framing.
6. Real-world case studies: include the Yapı Kredi/FICO case study from the supplied presentation, explicitly labelled vendor-reported and not an independent causal evaluation. Do not exaggerate its claims.
7. AI fraud detection workspace: synthetic transaction simulator, risk score, reason codes, low/medium/high risk bands, human-review guidance.
8. Financial prediction workspace: sample time-series forecast using clearly labelled demo data, forecast intervals and evaluation.
9. Public user portal: registration/login, profile, saved learning resources, report submission and status tracking.
10. AI assistant: chatbot for cyber safety, UPI fraud education, fraud-pattern explanation and navigation to verified sources.
11. Admin / Host dashboard: private content management, source/data management, user administration, model/demo configuration, audit logs and site settings.
12. About, methodology, privacy, terms, contact and emergency reporting guidance pages.

## Authentication and permissions — critical
Implement secure server-enforced role-based access control. Roles:
- `super_admin`: only the owner account, Thallapaka Jagadiswar (`jagadishkrishna7@gmail.com`).
- `reviewer`: optional read-only academic reviewer/HOD role, explicitly created by the super admin.
- `user`: ordinary registered users.
- `guest`: public unauthenticated visitor.

The owner email must NOT grant admin access merely through a client-side email comparison. Provision the super-admin role through a trusted server-side seed/admin process or secure database migration after the owner verifies the account. Never expose service-role keys or secrets in the browser. Public registration must never allow selecting `super_admin` or `reviewer`. Protect every admin API and database operation server-side, not only by hiding UI controls. Add MFA support if available, secure sessions, rate limiting, password reset, CSRF protections where applicable, input validation and audit logging.

Only the super admin can create or disable reviewer accounts, manage users, publish or edit official information, change data sources, and manage system settings. Ordinary users can read public information, use permitted demos, chat with the assistant and submit reports, but cannot edit official content or see other users' private submissions.

## Suggested stack
- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS with accessible reusable components.
- Charts: Recharts or equivalent.
- Backend: Python FastAPI.
- Database/auth: PostgreSQL with Supabase Auth or a comparably secure provider.
- ML: Python, pandas, scikit-learn; optionally XGBoost.
- Forecasting: statsmodels/ARIMA or Prophet only if dependencies and data justify it.
- AI assistant: OpenAI API called only from the backend; add retrieval-augmented generation (RAG) over approved, cited documents.
- Hosting: frontend Vercel; backend Render or AWS; managed PostgreSQL.
Use current supported versions and document exact setup.

## AI assistant requirements
- Use a backend endpoint; never expose API keys in frontend bundles.
- Ground answers in an approved knowledge base and cite links/sources where possible.
- Clearly say when information is unavailable or uncertain.
- Support English initially; structure for Telugu and Hindi later.
- Do not claim to file police complaints, contact banks, block payments, trace criminals or access private banking systems.
- For suspected financial cyber fraud in India, show guidance to contact the bank/payment provider immediately and call 1930 / use the National Cyber Crime Reporting Portal (https://cybercrime.gov.in/). Explain that the assistant is informational, not an emergency response service.
- Do not collect full card numbers, PINs, OTPs, passwords or unnecessary sensitive personal data in chat or report forms.

## ML and simulator requirements
Implement a transparent teaching demo using synthetic data. Include:
- Features such as transaction amount deviation, transaction velocity, new-device indicator, unusual location indicator and time-of-day deviation.
- A baseline rules-based demonstration clearly distinguished from a trained ML model.
- If a model is trained, document dataset provenance, labels, train/test split, class imbalance handling and evaluation.
- Show precision, recall, F1-score, PR-AUC and false-positive rate; do not use accuracy alone.
- Explain risk reasons and make clear a model score is not proof of fraud.
- No real payments, bank credentials or live transaction controls.
- Never automatically block or hold real transactions.

## Statistics and evidence requirements
Use official and reputable sources (for example RBI, National Crime Records Bureau, Ministry of Home Affairs / Indian Cyber Crime Coordination Centre, National Cyber Crime Reporting Portal, CERT-In and official annual reports). For every statistic show:
- Metric definition and unit.
- Geography and reporting population.
- Reporting period and publication date.
- Source organisation and direct source URL.
- Whether it is complaints, incidents, cases registered, amount involved, estimated loss, actual loss or recovery.
Do not combine incompatible measures. Do not present amount involved as actual loss. Do not fabricate current/live statistics. If official data is unavailable, display “Not available from verified source” rather than inventing a value. Distinguish sourced statistics from synthetic demo data in charts and cards.

## Data protection and security
- Use synthetic or anonymised data by default.
- Minimise collection of personal information.
- Encrypt traffic; use secure secret management and least privilege.
- Validate and sanitise user input; protect against common web vulnerabilities.
- Add audit logs for admin actions.
- Provide retention/deletion policies and privacy notice.
- Avoid displaying personally identifiable details in public fraud reports.
- Do not scrape private systems or attempt unauthorised access.

## Supplied presentation to use as project basis
Read `reference/AI_Financial_Prediction_Fraud_Detection_15_Slides.pdf`. Preserve its core framing:
- Predict, Detect, Learn.
- Financial prediction and fraud detection as two complementary tracks.
- Data pipeline: ingest, validate, clean, feature engineer, score, decide, learn.
- Fraud models: logistic regression, random forest, gradient boosting, neural networks and anomaly detection.
- Forecast models: linear regression and time-series approaches.
- Real-time decision workflow: ingest, enrich, score, decide, learn.
- Yapı Kredi case study, with the vendor-reported caveat.
- Illustrative Tirupati/Chennai suspicious payment example: ₹78,000, new overseas IP, unknown device, eight attempts in two minutes, illustrative score 0.97/1.00. Label this fictional teaching scenario.
- Metrics: precision, recall, F1-score, PR-AUC and false-positive rate.
- Risks: class imbalance, concept drift, false declines, data leakage, privacy/security and explainability.

## Deliverables
1. Working full-stack source code.
2. Database schema and secure role policies/migrations.
3. `.env.example` with placeholders only.
4. Seed script using synthetic demo data.
5. Unit/integration tests for auth, role permissions and key APIs.
6. README with local setup, deployment and admin provisioning steps.
7. Architecture diagram and API documentation.
8. Responsive UI with all required pages.
9. Clear demo-data labels and source citations.
10. A final checklist of what is implemented, what needs credentials, and what remains unavailable without official data access.

Build in phases and verify each phase. Do not claim the website is deployed until it actually is. Do not invent a deployed URL. First deliver a runnable local MVP, then harden security and prepare deployment.
