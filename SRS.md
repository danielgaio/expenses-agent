# **Software Requirements Specification (SRS)**

**Project:** Personal & Family Finance Assistant (Mobile + Web)  
**Prepared for:** Daniel Eliel Gaio  
**Date:** Oct 29, 2025  
**Version:** 1.0 (Draft)

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the functional and non-functional requirements for a multilingual, AI-powered personal finance application that supports multi-format input (image/audio/video/text), shared family accounts (including kids), agentic capabilities, analytics (visual and conversational), voice-enabled chat, future cash flow projections, and investment planning. Development will follow **Test-Driven Development (TDD)**.

### 1.2 Scope

- **Platforms:** React Native (Android & iOS), Next.js Web (Vercel)
- **Backend:** Supabase (Postgres, Auth, Storage, Functions/Edge)
- **AI Provider:** OpenAI (NLP, OCR\*, STT, TTS, agentic orchestration)
- **Key Features:** Multi-format capture, shared accounts, categorization, projections (future & installments), investment-as-expense, analytics (visual & chat), multilingual (English & Portuguese—Brazil), budgeting, recurring transactions, notifications, offline mode, import/export.

\*Note: OCR may be composed (OpenAI vision or external OCR if needed); this SRS specifies function, not vendor.

### 1.3 Definitions, Acronyms, Abbreviations

- **STT:** Speech-to-Text
- **TTS:** Text-to-Speech
- **RLS:** Row Level Security (Supabase)
- **PII:** Personally Identifiable Information
- **AI Assisted Extraction:** AI-driven parsing of content to structured transactions
- **Agentic:** Autonomous, goal-oriented AI actions within guardrails

### 1.4 References

- Product charter notes and requirements from prior discussions with the stakeholder.
- Applicable regulations for privacy and children’s data: **LGPD (Brazil), GDPR (EU)**; children’s protections analogous to **COPPA** principles for minors (parental consent, limited data processing). _Legal consultation recommended for final compliance posture._

### 1.5 Overview

Sections cover overall description, user personas, functional and non-functional requirements, data model, system architecture, security & compliance, testing (TDD), and acceptance criteria.

---

## 2. Overall Description

### 2.1 Product Perspective

- A cloud-first, mobile-first finance assistant with AI front-and-center to reduce manual entry friction.
- Works both **visually** (dashboards) and **conversationally** (chat + voice).
- Supports **shared family financial management** and long-term **investment planning**.

### 2.2 User Classes & Characteristics

- **Primary Adult User (Owner/Adult):** Full permissions; creates accounts, categories, budgets, and invites others.
- **Partner (Adult):** Similar to Owner, configurable permissions.
- **Child:** Restricted account (e.g., view-only, add expense with approval, no access to sensitive data).
- **Viewer/Advisor (Optional):** Read-only.

### 2.3 Operating Environment

- Mobile: iOS 15+ / Android 9+; Web: Evergreen browsers.
- Backend: Supabase (Postgres, Auth, Storage, Edge).
- Deployment: Vercel (Web), app stores (mobile).

### 2.4 Design & Implementation Constraints

- Technology stack fixed: Supabase, React Native, Next.js (Vercel), OpenAI.
- Must support **English** and **Portuguese (Brazil)**, including voice, chat, OCR/STT/NLP interpretation.
- TDD is mandatory across all layers.

### 2.5 Assumptions & Dependencies

- Stable internet is common, but **offline mode** must support local staging of entries with conflict resolution.
- Real-time exchange rates available for multi-currency conversion (vendor TBD).
- Bank integrations are future/optional and depend on Open Banking availability.

---

## 3. Functional Requirements

> MoSCoW priority label is provided: **M**ust, **S**hould, **C**ould, **W**on’t (for now).

### 3.1 Onboarding & Authentication

- **FR-1 (M):** Email + password, OAuth (Google/Apple), and **passkeys** support where available.
- **FR-2 (S):** Optional **2FA** (TOTP/SMS) and session management.
- **FR-3 (M):** Locale selection (English, Portuguese—Brazil), with default auto-detected and user-switchable.

### 3.2 Multi-Format Transaction Capture

- **FR-4 (M):** Users can submit **expenses/incomes** via:
  - Image (receipt photo), Audio (spoken), Video (with audio), Free text.
- **FR-5 (M):** AI-assisted extraction using OCR/STT/NLP with fields: `type` (expense/income), `amount`, `currency`, `date`, `merchant/payee`, `method`, `category suggestion`, `notes`, `language`, **confidence score**.
- **FR-6 (M):** Human-in-the-loop: review & correct with field-level **provenance** (AI vs user-edited).
- **FR-7 (S):** Line-item extraction from receipts (items, taxes, tips) when available.
- **FR-8 (M):** Error fallback: if AI fails, store raw artifact and prompt user for manual entry with pre-filled best-effort fields.

### 3.3 Categorization & Tagging

- **FR-9 (M):** User-defined categories + default set (e.g., `car_expenses`, `house_expenses`, `salary`, `investments`).
- **FR-10 (S):** Category suggestions and auto-learning from history.
- **FR-11 (S):** Optional **tags** for cross-cutting analysis (e.g., `vacation`, `school`).

### 3.4 Shared Accounts & Roles

- **FR-12 (M):** Create **shared accounts** (family wallets).
- **FR-13 (M):** Roles: Owner, Adult, Child, Viewer with **role-based permissions** and RLS.
- **FR-14 (S):** Approval workflows for **child-submitted** expenses.

### 3.5 Future & Recurring Transactions

- **FR-15 (M):** Support **not realized (future)** transactions for expenses & incomes (e.g., credit card installments).
- **FR-16 (M):** Recurring schedules (daily/weekly/monthly/quarterly/yearly/custom).
- **FR-17 (M):** Installments modeling (Brazil **parcelas**): principal amount, number of installments, start date, interest (if any), generated schedule.
- **FR-18 (S):** Bulk edit/cancel for recurring/remaining installments.

### 3.6 Investments as Expenses

- **FR-19 (M):** Record **investment contributions** as expenses (classified under `investments`).
- **FR-20 (S):** Future projections of planned contributions, scenario planning (e.g., increase by X%).
- **FR-21 (C):** (Optional) Track portfolio balance via external integrations; for now, **contribution-only**.

### 3.7 Multi-Currency

- **FR-22 (S):** Allow transactions in multiple currencies, store original amount and currency.
- **FR-23 (S):** Convert to **home currency** using current or chosen rate; record rate source and timestamp.

### 3.8 Budgeting

- **FR-24 (S):** Budgets per category/timeframe (monthly/quarterly/yearly).
- **FR-25 (S):** Alerts when nearing/exceeding limits; suggestions to optimize.

### 3.9 Notifications & Reminders

- **FR-26 (S):** Push/email notifications for upcoming bills, due installments, budget thresholds, investment reminders.

### 3.10 Analytics & Reporting

- **FR-27 (M):** **Visual analytics dashboard**: spending by category/time, income vs expenses, **cash flow forecast** (monthly/quarterly/yearly/semester/custom).
- **FR-28 (M):** **Conversational analytics**: natural language queries (“Top 3 categories this month?”, “Projection for next 6 months?”).
- **FR-29 (S):** Export: CSV, Excel, PDF reports (with filters).
- **FR-30 (C):** Import: CSV or OFX/QIF (mapping UI with preview & validation).

### 3.11 Conversational & Voice Mode

- **FR-31 (M):** Chat mode with **voice input** (STT) and **voice output** (TTS), maintaining session context (like ChatGPT conversation mode).
- **FR-32 (S):** Hands-free capture flow: “I spent R$ 45 at the bakery today” → structured expense.
- **FR-33 (S):** Wake word (mobile) if OS policies permit; otherwise long-press microphone UX.

### 3.12 Agentic Capabilities

- **FR-34 (M):** Autonomous categorization and proactive insights within guardrails.
- **FR-35 (S):** Goal-oriented workflows: “Help reduce monthly spending by 10%”; the agent suggests actions and tracks progress.
- **FR-36 (S):** Outlier detection & alerts for unusual spend patterns.
- **FR-37 (S):** Proactive reminders (e.g., “You usually add fuel expenses on Fridays—add now?”).

### 3.13 Internationalization & Localization

- **FR-38 (M):** Full support for **English** and **Portuguese (Brazil)** across UI, chat, voice, and AI interpretation.
- **FR-39 (M):** Locale-specific formatting (date, time, currency, decimal separators).
- **FR-40 (S):** Translation pipeline with **keys**, fallback, and language switch without app restart.

### 3.14 Offline & Sync

- **FR-41 (S):** Offline capture & queue (local storage), with retry and **conflict resolution** (last write wins + user diff review).
- **FR-42 (S):** Partial offline analytics (cached aggregates).

### 3.15 Error Handling & Observability

- **FR-43 (M):** Graceful degradation for AI failures; manual edit workflows.
- **FR-44 (M):** Centralized logging and tracing with PII redaction.
- **FR-45 (S):** In-app status center (recent sync/errors with retry).

### 3.16 Admin & Support

- **FR-46 (S):** Self-service: data export, account deletion, language and privacy settings.
- **FR-47 (S):** Support tickets; knowledge base (FAQ).

### 3.17 Optional Future: Bank/Open Banking Integrations

- **FR-48 (W):** Connect bank accounts for automatic imports; **Open Banking** compliant where available.

---

## 4. Data Model (Logical)

### 4.1 Core Entities

- **User**: id, name, email, locale, roles.
- **Household/Account**: id, name, currency, members (role).
- **Category**: id, name, type (expense/income/investment), parent_id (optional).
- **Transaction**:
  - id, household_id, user_id, **type** (expense|income|investment_contribution),
  - amount, currency, exchange_rate (nullable), **status** (realized|planned),
  - date (actual or planned), merchant/payee, method, notes, category_id, tags[],
  - source_artifact_id (nullable), ai_confidence (nullable), **provenance** (ai|user|mixed), language.
- **Installment_Schedule**: transaction_id, n_installments, interest_rate, schedule[] (date, amount, status).
- **Recurring_Rule**: id, frequency, start_date, end_date/null, next_run_at.
- **Artifact** (OCR/STT assets): id, type (image|audio|video|text), storage_uri, transcription, parsed_json, language, created_at.
- **Goal**: id, type (budget|savings|spend_reduction), target_value, due_date, progress.
- **Notification**: id, type, payload, status.
- **Audit_Log**: id, entity, action, actor_id, before/after snapshots (redacted).

### 4.2 Example Transaction JSON

```json
{
  "id": "txn_123",
  "household_id": "hh_1",
  "user_id": "usr_2",
  "type": "expense",
  "amount": 45.0,
  "currency": "BRL",
  "exchange_rate": null,
  "status": "realized",
  "date": "2025-10-28",
  "merchant": "Padaria Central",
  "method": "credit_card",
  "category_id": "cat_food",
  "tags": ["breakfast"],
  "source_artifact_id": "art_789",
  "ai_confidence": 0.86,
  "provenance": "mixed",
  "language": "pt-BR"
}
```

---

## 5. System Architecture

### 5.1 High-Level Components

- **Mobile App (React Native)** and **Web App (Next.js on Vercel)**
- **Supabase**: Postgres (RLS), Auth, Storage, Edge Functions
- **AI Services (OpenAI)**:
  - Vision/OCR (images), STT (audio/video), NLP extraction & categorization, TTS (voice replies), embeddings for semantic search, agentic orchestration (function/tool calling)
- **Analytics**: Client charts + server-side aggregations; optional materialized views
- **Observability**: Centralized logs, metrics, traces (e.g., OpenTelemetry-compatible pipeline)

### 5.2 Authorization & Tenancy

- **RLS** policies ensure users can only access data for households they belong to and within role permissions.
- **Role Matrix:** Owner (all), Adult (most), Child (restricted), Viewer (read-only).

### 5.3 Data Flow (Capture to Record)

1. User submits artifact (image/audio/video/text).
2. Stored in Supabase Storage → AI extraction pipeline (Edge Function).
3. Parsed result with confidence → pre-filled draft transaction.
4. User confirms or edits → final transaction saved with provenance.
5. If future/recurring/installments → schedule entries generated.
6. Aggregations updated; notifications scheduled.

### 5.4 Agentic Orchestration

- Tooling: **Functions** exposed to the agent: create_transaction, categorize, schedule_recurring, generate_projection, retrieve_analytics, send_notification.
- Safety: **Policy enforcer** checks role, scope, and user intent before executing tools.
- Memory: short-term session context; long-term derived preferences (e.g., category mapping) stored explicitly.

---

## 6. Internationalization & Accessibility

- **Languages:** English, Portuguese (Brazil) (UI, chat, voice, AI interpretation).
- **Formatting:** Locale-aware date, number, and currency formatting; Brazilian decimal separators.
- **Accessibility (WCAG 2.1 AA):** High contrast, dynamic font size, screen-reader labels, voice commands where applicable, captions/transcripts for audio features.

---

## 7. Security, Privacy & Compliance

### 7.1 Security

- **Encryption:** TLS in transit; at-rest encryption; sensitive columns optionally using pgcrypto.
- **Auth:** OAuth, passkeys, optional 2FA.
- **RLS:** Strict per-household, per-role policies.
- **Secrets Management:** Server-side only; no API keys in client.

### 7.2 Privacy

- **Data Minimization:** Store only required PII; redact logs; configurable retention.
- **User Controls:** Export, deletion (Right to Erasure), consent management for AI processing.
- **Children:** Parental/guardian consent, restricted processing for child accounts.

### 7.3 Compliance

- **LGPD/GDPR alignment** (consent, purpose limitation, data subject rights, breach notification process).
- Region-aware data residency (configurable if needed in future).

---

## 8. Non-Functional Requirements

### 8.1 Performance

- STT/OCR initial response target: **P95 < 3.5s** (network permitting).
- Analytics queries: **P95 < 1.5s** for cached common views; **< 4s** for heavy ranges.
- Sync latency (online): **< 1s** for transaction creation.

### 8.2 Availability & Scalability

- Target uptime: **99.5%** (Phase 1).
- Horizontal scaling for API functions and DB read replicas (future).
- Feature flags for safe rollouts.

### 8.3 Reliability & Backup

- Automated daily backups; **Point-In-Time Recovery** where supported.
- Disaster recovery RTO: 8 hours; RPO: 24 hours (Phase 1).

### 8.4 Maintainability

- Modular architecture; typed APIs; linting/formatting; ADRs (architecture decision records).

### 8.5 Usability

- Simple capture-first UI; minimal steps to record.
- Family-friendly language; onboarding tips and templates.

### 8.6 Observability

- Central logging, metrics, tracing; alerting on error rates, latency spikes, AI failure ratios.

---

## 9. Analytics & Projections

- **Timeframes:** monthly, quarterly, semiannual, annual, custom ranges.
- **Forecasts:** realized + planned + installments + recurring → **net cash flow** and **remaining cash** over time.
- **Investment Lens:** treat contributions as expenses; **projection** of contributions; scenario sliders.
- **Conversational Analytics:** NL queries producing charts/tables; voice readouts with short summaries.

---

## 10. External Interfaces

### 10.1 User Interfaces

- Mobile (RN): Capture-first home, transaction list, analytics, chat, settings.
- Web (Next.js): Full dashboards and management; responsive for desktop/tablet.

### 10.2 APIs

- Supabase PostgREST + Edge Functions (secured).
- AI endpoints (server-side) for OCR/STT/NLP/TTS; function calling for agent actions.

### 10.3 Notifications

- Push (FCM/APNs), email provider (TBD).

### 10.4 Import/Export

- CSV/XLSX/PDF exports; CSV/OFX import with mapping wizard.

---

## 11. TDD, QA & DevOps

### 11.1 TDD Strategy

- **Unit Tests:**
  - Frontend: Jest/React Testing Library.
  - Server/Edge: Vitest/Jest.
  - DB: SQL-level tests (e.g., pgTAP or Supabase Testing).
- **Integration Tests:**
  - AI extraction pipeline with **golden fixtures** (receipts, audio samples) and expected parsed outputs.
  - Auth + RLS permissions tests.
- **E2E Tests:**
  - Mobile: **Detox**.
  - Web: **Playwright**.
  - Critical flows: capture → review → save → analytics view; chat Q&A; voice mode; offline sync.
- **Performance Tests:** k6 or Lighthouse CI for web.
- **Security Tests:** Dependency scanning; basic DAST for endpoints.

### 11.2 CI/CD

- GitHub Actions (or similar):
  - Lint → Unit → Integration → E2E (PR gates) → Build & Deploy (staging/prod).
  - Feature flags for phased releases.
  - App store pipelines (fastlane) with automated screenshots (optional).

### 11.3 Monitoring & Alerting

- Error tracking (e.g., Sentry) with PII redaction.
- Metrics dashboards (latency, throughput, AI failure rate, queue depth).
- On-call alerts for sustained P95 degradation or high error budgets.

---

## 12. Acceptance Criteria (Samples)

- **AC-1:** User can add a receipt photo; system extracts amount/date/merchant with confidence shown; user adjusts and saves within one flow.
- **AC-2:** Voice conversation: user asks in Portuguese “Qual foi meu gasto com mercado este mês?”; agent responds in Portuguese with a spoken and textual summary and chart.
- **AC-3:** Shared account: Child adds an expense; Adult receives approval notification; upon approval, expense appears in analytics.
- **AC-4:** Installments: Creating a 10x credit card purchase generates 10 planned entries; analytics includes them in projections.
- **AC-5:** Investment contributions are visible under expenses and in a dedicated investment contributions timeline and forecast.
- **AC-6:** Language switch changes UI, formatting (e.g., “R$ 1.234,56”), and agent responses accordingly.
- **AC-7:** Offline entry is queued and syncs automatically with conflict resolution when online.
- **AC-8:** Budgets trigger alerts when 90% consumption is reached.

---

## 13. Risks & Mitigations

- **AI extraction variability:** Provide human-in-the-loop editing and confidence display; maintain **training dataset** of anonymized, consented samples.
- **Latency of AI calls:** Batch/parallelize where possible; caching; fallback to deferred processing with user notification.
- **Privacy with children:** Strict role policies; consent records; limit data exposure in UI.
- **Vendor lock-in:** Abstract AI calls behind internal service; define portable contract for OCR/STT/NLP.

---

## 14. Roadmap (High-Level Milestones)

1. **MVP (8–12 weeks)**
   - Auth, households & roles, categories, basic capture (image, text), AI extraction v1, manual review, transactions CRUD, analytics basics, projections (planned & installments), investment-as-expense, English + Portuguese, TDD foundations, CI/CD, RLS, observability core.
2. **Voice & Chat (4–6 weeks)**
   - STT/TTS, conversational analytics, voice replies, context handling, notifications.
3. **Budgets & Recurring (3–4 weeks)**
   - Budgeting UI, alerts, recurring engine, installment polish.
4. **Offline & Import/Export (3–4 weeks)**
   - Offline queue, conflict resolution, CSV/XLSX export, CSV import wizard.
5. **Enhancements (ongoing)**
   - Proactive agent, multi-currency, accessibility polish, performance tuning, optional bank integrations.

---

## 15. Traceability (Requirements → Features)

- Multi-format capture: **FR-4–FR-8**
- Shared accounts & kids: **FR-12–FR-14**
- Categorization: **FR-9–FR-11**
- Future/recurring/installments: **FR-15–FR-18**
- Investments-as-expense: **FR-19–FR-21**
- Analytics & conversational: **FR-27–FR-33**
- Agentic: **FR-34–FR-37**
- i18n & formatting: **FR-38–FR-40**
- Offline/sync: **FR-41–FR-42**
- Notifications: **FR-26**
- Export/Import: **FR-29–FR-30**
- Security/Privacy/Compliance: Section 7
- TDD/CI/CD/Observability: Section 11

---

## 16. Glossary

- **Parcelas:** Brazilian practice of splitting payments into fixed installments.
- **Household/Account:** Shared financial space for a family/group.
- **Provenance:** Indicates whether a field was AI-extracted or user-edited (or both).

---

### Appendix A — Example RLS Considerations (Conceptual)

- `transactions.household_id IN (SELECT household_id FROM memberships WHERE user_id = auth.uid())`
- Child role cannot read `amount` for other users unless explicitly allowed; or cannot see adult income categories—configurable by owner.

### Appendix B — Example Test Fixtures

- Receipt images (EN/PT-BR) for: supermarket, fuel, restaurant (with tips), utility bill.
- Audio samples (noisy/clean) with accents (pt-BR regional variations).
- Edge cases: multi-currency receipt, refundable transaction, split categories.

---

### **Gamification Features for Financial Independence**

#### **Objective**
Encourage users to actively engage with financial planning and achieve long-term financial independence through motivational, game-like elements integrated into the app.

---

#### **Functional Requirements**

**GF-1: Financial Independence Score**
- **Description:** Calculate and display a dynamic score representing the user’s progress toward financial independence.
- **Details:**
  - Based on factors like savings rate, investment contributions, expense-to-income ratio, and goal completion.
  - Update in real-time as transactions and goals change.
  - Visual representation (progress bar, badge level).

---

**GF-2: Levels & Milestones**
- **Description:** Introduce levels tied to financial health milestones.
- **Details:**
  - Example levels: *Starter*, *Planner*, *Investor*, *Freedom Builder*, *Financially Independent*.
  - Unlock levels when achieving goals (e.g., saving 3 months of expenses, reaching 20% savings rate).
  - Show milestone badges in profile and analytics dashboard.

---

**GF-3: Challenges & Quests**
- **Description:** Offer optional challenges to improve habits.
- **Examples:**
  - “Save \$100 extra this month.”
  - “Reduce discretionary spending by 10%.”
  - “Invest every week for 3 months.”
- **Details:**
  - Challenges can be time-bound or recurring.
  - Completion rewards: points, badges, or virtual trophies.

---

**GF-4: Streaks & Consistency Tracking**
- **Description:** Track and reward consistent positive actions.
- **Details:**
  - Examples: logging expenses daily, meeting monthly savings goals.
  - Display streak counters and celebrate milestones (e.g., “30-day streak!”).

---

**GF-5: Leaderboards (Optional for Shared Accounts)**
- **Description:** For family/shared accounts, show friendly leaderboards.
- **Details:**
  - Metrics: most consistent logger, highest savings contribution.
  - Privacy controls: opt-in only.

---

**GF-6: Goal Visualization**
- **Description:** Gamify goal tracking with visual metaphors.
- **Examples:**
  - Growing a tree as savings increase.
  - Building a house as investment contributions accumulate.

---

**GF-7: Rewards System**
- **Description:** Points or badges for completing actions.
- **Details:**
  - Actions: adding transactions, completing challenges, achieving goals.
  - Points redeemable for in-app perks (e.g., premium themes) or just motivational.

---

**GF-8: Social Sharing (Optional)**
- **Description:** Allow users to share achievements externally.
- **Details:**
  - Share badges or milestones on social media.
  - Privacy-first: user consent required.

---

#### **Technical Requirements**
- **GF-9:** Gamification engine integrated with transaction, goal, and analytics modules.
- **GF-10:** Configurable thresholds for levels and challenges.
- **GF-11:** Localization for gamification texts and visuals (English and Portuguese—Brazil).
- **GF-12:** Offline support for streak tracking; sync when online.
- **GF-13:** TDD coverage for gamification logic (score calculation, challenge validation).

---

#### **Non-Functional Requirements**
- **Performance:** Score updates and badge unlocks must occur within **<500ms** after relevant action.
- **Scalability:** Gamification engine must support thousands of concurrent users without degradation.
- **Usability:** Gamification elements should be optional and non-intrusive.

---

## **Gamification — Financial Independence Score (FIS)**

### **Objective**
Provide a single, interpretable metric (0–100) that reflects a user’s momentum toward Financial Independence (FI), based on **Savings Rate**, **Investment Contribution Ratio**, and **Time to FI (projection)**. The score updates in real-time as new transactions and goals are recorded.

> **Disclaimer:** The score and projections are **educational** and **not financial advice**. Assumptions (returns, inflation, withdrawal rate) are configurable by the user.

---

### **Inputs & Definitions**

- **Income (net, monthly)**: `INC_m`
- **Expenses (monthly)**: `EXP_m`
- **Savings (monthly)**: `SAV_m = max(INC_m − EXP_m, 0)`
- **Investment Contributions (monthly)**: `INV_m` (subset of savings recorded under investments)
- **Home Currency**: e.g., `BRL` (store original currencies + converted)
- **Current Investable Net Worth**: `NW` (liquid/retirement/investment accounts; optional at first run)
- **Annual Core Expenses**: `E_a = 12 * EXP_m` (user can override)
- **Withdrawal Rate (real)**: `w` (default **4%**, configurable)
- **Real Expected Return (net of inflation)**: `R` (default **5%**, configurable)
- **Time Pivot (years)**: `τ` (default **15**—“ideal” target midpoint for FI)
- **Horizon Cap (years)**: `H` (default **40**—beyond which score approaches zero)
- **Smoothing/Logistic parameter**: `k` (default **0.18**; higher k makes the time component more sensitive)

**FI Target (real terms):**  
`Target = T = E_a / w` (e.g., if E_a = R$120k and w = 0.04 → T = R$3.0M)

---

### **Normalization Helpers**
- **Clamp:** `clamp(x, a, b) = min(max(x, a), b)`
- **Logistic:** `L(x; k, x0) = 1 / (1 + e^{k(x − x0)})`

---

### **Component 1 — Savings Rate Score (SRS)**
Savings rate as a share of income, mapped to 0–100 with gentle diminishing returns.

1) **Savings Rate:**  
`SR = { 0 if INC_m = 0;  clamp(SAV_m / INC_m, 0, 1.0) otherwise }`

2) **Score Mapping (diminishing returns):**  
`SRS = 100 * (1 − e^{−α * SR}) / (1 − e^{−α})`, with `α = 3.0` (tunable)

- Properties:  
  - SR=0 → SRS=0  
  - SR=50% → SRS≈79  
  - SR=100% → SRS=100

---

### **Component 2 — Investment Contribution Ratio Score (IRS)**  
Rewards channeling a meaningful portion of savings into long‑term investments.

1) **Investment Ratio:**  
If `SAV_m > 0`: `IR = clamp(INV_m / SAV_m, 0, 1)`  
Else if `SAV_m = 0` and `INV_m > 0`: treat `IR = 1` (aggressive investing despite zero net savings)  
Else `IR = 0`.

2) **Score Mapping (encourage ≥80% allocation):**  
`IRS = 100 * clamp(IR / 0.8, 0, 1) ^ β`, with `β = 0.8` (slight concavity)

- Properties:  
  - IR=0 → IRS=0  
  - IR=0.5 → IRS≈72  
  - IR≥0.8 → IRS=100

*(Implementation note: optionally cap IRS if user lacks an emergency fund; this is out of scope here but can be added as a separate constraint flag.)*

---

### **Component 3 — Time-to-FI Score (TTS)**

**Goal:** Convert **projected years to FI** into a 0–100 score.

1) **Years to FI Projection (`Y_FI`):**  
Use annual cadence (can also implement monthly variant). If `NW ≥ T`, set `Y_FI = 0`.

Otherwise solve for `n` in:  
`NW * (1 + R)^n + PMT_a * ((1 + R)^n − 1) / R ≥ T`,  
where `PMT_a = 12 * INV_m` (annualized monthly investment contributions).

Closed form (for `R > 0` and `NW + PMT_a / R > 0`):

```
A = (T + PMT_a / R) / (NW + PMT_a / R)
Y_FI = n = ln(A) / ln(1 + R)
```

**Edge cases:**
- If `R = 0`: `Y_FI = (T − NW) / PMT_a` (if `PMT_a > 0`, else `∞`).
- If denominator invalid or `A ≤ 0`: set `Y_FI = ∞`.
- Cap to **H**: `Y_cap = min(Y_FI, H)`; if infinite, treat as `H`.

2) **Score Mapping (logistic for smoothness):**  
`TTS = 100 * L(Y_cap; k, τ) = 100 / (1 + e^{k * (Y_cap − τ)})`

- With defaults `k=0.18`, `τ=15`, `H=40`:  
  - 5 years → TTS≈83  
  - 15 years → TTS≈50  
  - 30 years → TTS≈22  
  - 40+ years → TTS≈16 (approaches lower bound)

---

### **Composite Score**

Weights default to emphasize savings behavior and goal attainability.

```
FIS = w1*SRS + w2*IRS + w3*TTS
where (w1, w2, w3) = (0.40, 0.20, 0.40)  and  FIS ∈ [0, 100]
```

*(Configurable per-org or per-user; persist chosen weights for reproducibility.)*

---

### **Worked Example (pt-BR numbers)**

- `INC_m = R$ 12.000`  
- `EXP_m = R$ 9.000` → `SAV_m = R$ 3.000`  
- `INV_m = R$ 2.400` → `IR = 0.8` → `IRS = 100`  
- `NW = R$ 200.000`  
- `E_a = 12 * 9.000 = R$ 108.000`  
- `w = 0.04` → `T = 108.000 / 0.04 = R$ 2.700.000`  
- `R = 0.05` (real)  
- `PMT_a = 12 * 2.400 = R$ 28.800`

Compute `Y_FI`:

```
A = (2.700.000 + 28.800 / 0.05) / (200.000 + 28.800 / 0.05)
  = (2.700.000 + 576.000) / (200.000 + 576.000)
  = 3.276.000 / 776.000 ≈ 4,2227

Y_FI = ln(4,2227) / ln(1,05) ≈ 1,441 / 0,04879 ≈ 29,54 anos
```

Map to scores:

- `SRS`: `SR = 3.000 / 12.000 = 0,25`  
  `SRS = 100 * (1 − e^{−3*0,25}) / (1 − e^{−3}) ≈ 100 * (1 − e^{−0,75}) / 0,9502 ≈ 52`  
- `TTS`: with `k=0.18`, `τ=15`, `Y_cap=29,54`:  
  `TTS ≈ 100 / (1 + e^{0,18*(29,54−15)}) ≈ 100 / (1 + e^{2,618}) ≈ 6,6%?`  
  Recalculate carefully: `e^{2,618} ≈ 13,72` → `TTS ≈ 100 / 14,72 ≈ 6,79`  
  *(If you prefer a less harsh curve, reduce `k` to 0.12 → TTS≈13.5)*  
- `IRS = 100`

Composite (k=0.18):  
`FIS = 0.40*52 + 0.20*100 + 0.40*6,8 ≈ 20,8 + 20 + 2,7 ≈ 43,5`

> **Note:** Adjust `k`, `τ`, or weights to match the motivational profile you want. For example, **k=0.12** produces a less punitive time component.

---

### **Functional Requirements (FIS Engine)**

- **FIS-1 (M):** Compute `FIS` on every transaction change that affects `INC_m`, `EXP_m`, `INV_m`, or when user updates `NW`, `R`, `w`, or weights.  
- **FIS-2 (M):** Persist inputs, assumptions, and **explainability payload** (component scores, parameters, and the `Y_FI` projection) for auditability and user transparency.  
- **FIS-3 (S):** Allow per-user customization of `R`, `w`, `(w1,w2,w3)`, and curve params `(α, β, k, τ, H)` with safe defaults & reset-to-default.  
- **FIS-4 (M):** Multicurrency-safe: compute base metrics in **home currency** with stored exchange rates & timestamps.  
- **FIS-5 (S):** Cache latest FIS and invalidate/reactively recompute on relevant changes.  
- **FIS-6 (S):** Show “what-if” mode to preview FIS changes from hypothetical contribution/budget edits (no persistence).  
- **FIS-7 (M):** i18n: English and Portuguese (Brazil) labels and explanations.  
- **FIS-8 (M):** TDD coverage: unit tests for each component, edge cases (SR=0, `INV_m>SAV_m`, `R=0`, infinite `Y_FI`), and numerical stability.

---

### **Acceptance Criteria (FIS)**

- **AC-FIS-1:** Given `INC_m=0`, `EXP_m>0`, then `SR=0`, `SRS=0`, FIS computes without error.  
- **AC-FIS-2:** When `NW ≥ T`, then `Y_FI=0` and `TTS≈100` (subject to logistic mapping), FIS increases accordingly.  
- **AC-FIS-3:** Changing `R` from 3%→7% (all else equal) **decreases** `Y_FI` and **increases** `TTS` and `FIS`.  
- **AC-FIS-4:** Changing `INV_m` from 0.5*SAV_m to 0.8*SAV_m increases `IRS` (capped at 100).  
- **AC-FIS-5:** All displayed values reflect home currency formatting (e.g., `R$ 1.234,56` in `pt-BR`).

---

## **Gamification — Example User Stories & Acceptance Criteria**

> Stories reference earlier features `GF-1` … `GF-13`. Use these in your backlog.

### **EPIC: Financial Independence Score (GF-1)**

1) **Story:** As an adult user, I want to see my **FIS** and its breakdown so I understand what drives my progress.  
   **Acceptance Criteria:**
   - The dashboard shows **FIS**, `SRS`, `IRS`, `TTS`, and `Y_FI` in my selected language.  
   - A tooltip explains formulas and the current assumptions (`R`, `w`, weights).  
   - Updating `R` or `w` recalculates FIS within **<500ms** (cached inputs).

2) **Story:** As a user, I can run a **what‑if** simulation (e.g., increase `INV_m` by 10%) to preview impact on FIS.  
   **Acceptance Criteria:**
   - A side panel allows adjusting `INV_m`, `EXP_m`, `NW` (temporary).  
   - The UI shows the delta on `FIS` and `Y_FI` without persisting changes.  
   - “Apply” persists and triggers a real recompute.

---

### **EPIC: Levels & Milestones (GF-2)**

1) **Story:** As a user, I unlock levels based on objective thresholds (e.g., **SRS ≥ 0.20** for 3 consecutive months).  
   **Acceptance Criteria:**
   - Level rules are versioned and evaluated monthly.  
   - Unlock events log to **Audit_Log** and trigger a badge animation.  
   - Localization present for names: _Starter_, _Planner_, _Investor_, _Freedom Builder_, _FI_.

2) **Story:** As an owner, I want milestone badges (e.g., **Emergency Fund 3× Expenses**, **Savings Rate 30%**).  
   **Acceptance Criteria:**
   - Badge unlocks show criteria met, date achieved, and are visible in profile.  
   - Badge logic runs on a scheduled job and on-demand recompute.

---

### **EPIC: Challenges & Quests (GF-3)**

1) **Story:** As a user, I can opt into a **spend reduction** challenge (e.g., −10% vs last month in `restaurants`).  
   **Acceptance Criteria:**
   - Challenge config defines target category, baseline window, target delta, and duration.  
   - Progress updates daily; completion awards **points** and **badge**.  
   - If multi-currency, comparisons use normalized home currency.

2) **Story:** As a user, I can join a **contribution streak** challenge (e.g., invest weekly for 12 weeks).  
   **Acceptance Criteria:**
   - Each qualifying investment increases streak; missed periods break it.  
   - Streak status is tolerant of clock skew (uses server time windows).  
   - Completion awards points and boosts a **Streak Badge**.

---

### **EPIC: Streaks & Consistency (GF-4)**

1) **Story:** As a user, I want to see my **expense logging streak** and be reminded before midnight to keep it alive.  
   **Acceptance Criteria:**
   - Streak increments when ≥1 new transaction is added and confirmed for the day.  
   - Reminder notification is sent 2 hours before the user’s local day end (opt‑out).

---

### **EPIC: Leaderboards (GF-5)**

1) **Story:** As a household member, I can **opt-in** to friendly leaderboards (e.g., “highest savings rate this month”).  
   **Acceptance Criteria:**
   - Opt‑in per member; children accounts hidden by default.  
   - Ranks computed with anonymized initials unless full name sharing is consented.

---

### **EPIC: Goal Visualization (GF-6)**

1) **Story:** As a user, I want a **visual metaphor** (tree/house) that fills up as my FI progress (FIS and `NW/T`) grows.  
   **Acceptance Criteria:**
   - Progress binds to `min(NW/T, 1)` and `FIS/100`.  
   - Animation is accessible (reduced‑motion setting respected).

---

### **EPIC: Rewards System (GF-7)**

1) **Story:** As a user, I earn **points** for actions (adding transactions, completing challenges, hitting budgets).  
   **Acceptance Criteria:**
   - Points ledger shows source, timestamp, and amount.  
   - Point awards are idempotent (replays do not duplicate).

2) **Story:** As a user, I can redeem points for **in‑app perks** (themes) or just keep them as motivation.  
   **Acceptance Criteria:**
   - Perks inventory is localized; redemptions are reversible within 5 minutes.

---

### **EPIC: Social Sharing (GF-8)**

1) **Story:** As a user, I can share a **milestone card** (image) without revealing amounts (privacy-safe).  
   **Acceptance Criteria:**
   - Share dialog previews the card and clearly states what’s included/excluded.  
   - Exports localized image with app watermark and opt‑out toggle.

---

### **Voice & Conversational (cross-cutting)**

1) **Story:** As a user, I can ask: _“Quanto falta para minha independência financeira?”_  
   **Acceptance Criteria:**
   - Agent answers in the current language with: `Y_FI`, `FIS`, and one actionable tip (e.g., “Increasing INV_m by R$200/mo reduces Y_FI by ~0.8 years”).  
   - The agent cites current parameters (`R`, `w`) and offers to open **what‑if**.

---

### **Non-Functional (Gamification Layer)**

- **Perf:** Recomputing FIS and unlocking badges must complete **<500ms P95** after relevant actions (front-end cached; server recompute <250ms).  
- **Reliability:** Idempotent award logic; deduplication keys (`user_id`, `rule_id`, `period`).  
- **i18n:** All gamification texts, rules, and notifications fully localized in **English** and **Portuguese (Brazil)**.  
- **Privacy:** Leaderboards and social sharing are **opt-in**; child accounts excluded unless guardian enables.

---

### **Data Model Additions (Minimal)**
- `user_settings`: `expected_real_return`, `withdrawal_rate`, `fis_weights`, `curve_params`, `home_currency`.  
- `fi_snapshot`: `user_id`, `timestamp`, `SRS`, `IRS`, `TTS`, `Y_FI`, `FIS`, `assumptions_json`, `explain_json`.  
- `badges`, `levels`, `challenges`, `points_ledger`, `streaks`: normalized tables with rule versions and audit metadata.

---

## **Educational Module — Gamified Financial Learning**

### **Objective**
Provide an engaging, structured learning experience for users to build financial literacy and confidence before using advanced features. The module should feel like a standalone product but remain integrated with the main app for seamless progression.

---

### **Scope**
- **Independent Access:** Users can enter the Educational module from the home screen without interacting with other finance features.
- **Style:** Gamified micro-lessons (Duolingo) + interactive problem-solving (Brilliant).
- **Goal:** Teach concepts like budgeting, saving, investing, financial independence, and risk management through progressive levels.

---

### **Functional Requirements**

#### **EM-1: Independent Entry Point**
- **Description:** Educational module accessible via a dedicated tab or onboarding flow.
- **Details:**
  - No requirement to set up accounts, budgets, or link financial data.
  - Progress saved per user account.

---

#### **EM-2: Learning Paths**
- **Description:** Organize content into **tracks** (e.g., “Basics of Budgeting”, “Investing 101”, “Financial Independence Fundamentals”).
- **Details:**
  - Each track has **levels** and **units**.
  - Units contain **lessons** (micro-content) and **interactive exercises**.

---

#### **EM-3: Gamification**
- **Features:**
  - **XP Points:** Earned for completing lessons and challenges.
  - **Streaks:** Daily engagement tracked and rewarded.
  - **Badges:** For milestones (e.g., completing a track, maintaining a streak).
  - **Leaderboards (Optional):** For friendly competition among opt-in users.

---

#### **EM-4: Lesson Types**
- **Description:** Lessons combine:
  - **Micro-reading** (short, clear explanations).
  - **Interactive quizzes** (multiple-choice, drag-and-drop).
  - **Scenario-based exercises** (e.g., “Plan a monthly budget for a family”).
  - **Visual aids** (charts, animations).
- **Details:**
  - Lessons localized in **English** and **Portuguese (Brazil)**.
  - Adaptive difficulty based on user performance.

---

#### **EM-5: Interactive Problem Solving**
- **Description:** Inspired by Brilliant:
  - Step-by-step reasoning exercises.
  - Immediate feedback with hints.
  - “Explore More” links for deeper dives.

---

#### **EM-6: Progression System**
- **Description:** Unlock next lessons only after completing prerequisites.
- **Details:**
  - Show progress bars for tracks and overall mastery.
  - Offer **placement test** for advanced users to skip basics.

---

#### **EM-7: Personalization**
- **Description:** Recommend tracks based on:
  - User goals (e.g., “Financial Independence”).
  - Past performance.
- **Details:**
  - Optional survey during onboarding.

---

#### **EM-8: Offline Support**
- **Description:** Lessons and quizzes available offline.
- **Details:**
  - Sync progress when online.

---

#### **EM-9: Notifications**
- **Description:** Reminders for streaks and new lessons.
- **Details:**
  - Configurable frequency.
  - Localized content.

---

#### **EM-10: Integration with Main App**
- **Description:** When user completes advanced tracks, suggest enabling main finance features.
- **Details:**
  - Example: After “Budgeting Basics”, prompt to create a real budget.

---

### **Technical Requirements**
- **EM-11:** Content stored in Supabase with versioning.
- **EM-12:** Gamification engine shared with main app but scoped for education.
- **EM-13:** TDD coverage for lesson rendering, progress tracking, and XP logic.
- **EM-14:** Localization for all texts and media (English, Portuguese—Brazil).
- **EM-15:** Accessibility compliance (WCAG 2.1 AA).

---

### **Non-Functional Requirements**
- **Performance:** Lesson load time < 1s; quiz feedback < 300ms.
- **Scalability:** Support thousands of concurrent learners.
- **Usability:** Simple, distraction-free UI; onboarding tutorial for module navigation.

---

### **Example User Stories**
1. **As a beginner, I want to learn budgeting basics without linking my bank account, so I feel safe and not overwhelmed.**
   - **Acceptance:** Educational module accessible without financial setup.
2. **As a user, I want to earn XP and badges for completing lessons, so I stay motivated.**
   - **Acceptance:** XP increments after each lesson; badges unlock at milestones.
3. **As a learner, I want interactive exercises with hints, so I understand concepts deeply.**
   - **Acceptance:** Each exercise provides instant feedback and optional hints.
4. **As a user, I want to maintain a streak and receive reminders, so I build a habit.**
   - **Acceptance:** Streak counter updates daily; notifications sent at configured times.

---

### **Data Model Additions**
- `edu_tracks`: id, name, description, language, version.
- `edu_lessons`: id, track_id, type (quiz|reading|scenario), content_json.
- `edu_progress`: user_id, track_id, lesson_id, status, xp, streak_count.
- `edu_badges`: id, name, criteria_json, icon_uri.

---

## **Gamification Logic for Educational Module**

### **XP System**
- **XP Formula:**  
  ```
  XP = BaseXP + BonusXP
  ```
  - **BaseXP per Lesson:** 10 XP  
  - **BaseXP per Quiz Question:** 5 XP  
  - **BaseXP per Interactive Exercise:** 15 XP  
  - **BonusXP:**  
    - Perfect score on quiz: +10 XP  
    - Completing a track: +50 XP  
    - Maintaining a streak: +5 XP per day beyond 3-day streak  

- **XP Thresholds for Levels:**  
  - Level 1: 0–99 XP  
  - Level 2: 100–249 XP  
  - Level 3: 250–499 XP  
  - Level 4: 500–999 XP  
  - Level 5+: Every additional 500 XP unlocks a new level  

---

### **Streak Logic**
- **Definition:** A streak is the number of consecutive days the user completes at least one lesson or exercise.
- **Rules:**  
  - Streak increments if user completes ≥1 lesson in a day.  
  - Breaks if no lesson completed by local midnight.  
  - Grace period: 1 “streak freeze” token per 7-day streak (earned automatically).  

- **Rewards:**  
  - 3-day streak: +10 XP  
  - 7-day streak: Badge “Consistency Starter”  
  - 30-day streak: Badge “Financial Learner Pro”  

---

### **Badges**
- **Badge Categories:**  
  - **Progress Badges:** Completing tracks (e.g., “Budgeting Basics Master”).  
  - **Performance Badges:** Perfect quiz scores (e.g., “Quiz Ace”).  
  - **Consistency Badges:** Streak milestones (7, 30, 100 days).  
  - **Challenge Badges:** Completing special challenges (e.g., “Investment Explorer”).  

- **Badge Unlock Criteria:**  
  - Stored in `criteria_json` (e.g., `{ "type": "streak", "value": 30 }`).  
  - Evaluated on lesson completion and scheduled jobs.

---

### **Leaderboard (Optional)**
- **Scope:** Household or global (opt-in only).  
- **Metric:** Total XP or streak length.  
- **Privacy:** Display initials unless full name consented.

---

### **Integration with Main App**
- XP and badges stored in shared gamification engine but scoped to `edu_module`.  
- Optional cross-feature synergy: Completing advanced tracks unlocks **discounts** or **themes** in main app.

---

## **Roadmap for Content Creation & Integration**

### **Phase 1 — Foundation (Weeks 1–4)**
- **Tasks:**
  - Define **curriculum structure**: Tracks → Units → Lessons.
  - Create **content templates** (lesson JSON schema).
  - Implement **XP engine**, streak tracking, and badge logic.
  - Build **basic UI** for lessons and progress dashboard.
- **Deliverables:**
  - Tracks: “Budgeting Basics”, “Saving Strategies”.
  - 20 lessons (10 per track).
  - Gamification backend integrated with Supabase.

---

### **Phase 2 — Interactive Learning (Weeks 5–8)**
- **Tasks:**
  - Add **interactive exercises** (drag-and-drop, scenario-based).
  - Implement **adaptive difficulty** (based on quiz performance).
  - Add **visual metaphors** (progress tree or ladder).
- **Deliverables:**
  - Tracks: “Investing 101”, “Financial Independence Fundamentals”.
  - 30 new lessons.
  - Interactive components tested with TDD.

---

### **Phase 3 — Advanced Gamification (Weeks 9–12)**
- **Tasks:**
  - Add **leaderboards** (opt-in).
  - Implement **challenge system** (weekly/monthly challenges).
  - Enable **social sharing** of badges.
- **Deliverables:**
  - Challenges: “7-Day Budget Challenge”, “Investment Habit Builder”.
  - Badge catalog finalized.
  - Notifications for streak reminders.

---

### **Phase 4 — Integration & Personalization (Weeks 13–16)**
- **Tasks:**
  - Link educational progress to main app suggestions (e.g., after “Budgeting Basics”, prompt to create a real budget).
  - Add **personalized track recommendations** based on user goals.
- **Deliverables:**
  - Recommendation engine.
  - Onboarding flow with optional placement test.

---

### **Phase 5 — Continuous Expansion**
- **Tasks:**
  - Add advanced tracks (tax planning, retirement strategies).
  - Localize all content for **English** and **Portuguese (Brazil)**.
  - Gather feedback and iterate on gamification thresholds.

---

# **Accounting Reports (Optional & Progressive)**  
*(DRE / Income Statement, Cash Flow Statement, Balance Sheet)*

## 1) Objective & Scope
Provide three standard financial views tailored for personal/family finance:

- **DRE / Income Statement** *(pt‑BR: Demonstração do Resultado do Exercício)* — Income vs. expenses for a period, yielding **net savings (surplus/deficit)**.  
- **Cash Flow Statement** *(pt‑BR: Fluxo de Caixa)* — Actual **cash movements** by activity (Operating, Investing, Financing), direct method.  
- **Balance Sheet** *(pt‑BR: Balanço Patrimonial / Patrimônio)* — **Assets, Liabilities, Net Worth** at a point in time.

These features are **off by default**, discoverable via **opt‑in** or **unlocked** after completing relevant **Educational tracks** (e.g., “Budgeting Basics”, “Investing 101”).

> **Disclaimer:** Reports are educational aids and not accounting or financial advice.

---

## 2) Access, Gating & Roles

- **AR-GATE-1 (M):** Reports are hidden until either:  
  a) User **opts in** via Settings ➜ Advanced ➜ Reports, or  
  b) User completes **Educational tracks**: _Budgeting Basics_ (unlocks DRE & Cash Flow) and _Investing 101_ (unlocks Balance Sheet).
- **AR-GATE-2 (M):** Show a **guided intro** the first time a report is opened (explain sections and data sources).
- **AR-ROLE-1 (M):** Respect existing roles/RLS:  
  - **Owner/Adult:** Full access.  
  - **Child:** No visibility into adult incomes by default; can be granted limited view per household setting.  
  - **Viewer:** Read‑only.

---

## 3) Functional Requirements

### 3.1 DRE / Income Statement (Period-based P&L for Individuals)

- **AR-DRE-1 (M):** Generate DRE for a selectable period (monthly, quarterly, yearly, custom).  
  - **Revenues (Incomes):** Sum of **realized** income transactions.  
  - **Operating Expenses:** Sum of **realized** expense transactions (configurable category mapping).  
  - **Other Income/Expenses:** Gains/losses from asset sales or one‑offs (via tag or category mapping).  
  - **Net Result (Surplus/Deficit):** `Revenues − Expenses`.
- **AR-DRE-2 (S):** Toggle **“Include planned”** overlay to show a dotted forecast line (planned/future, installments, recurring).  
- **AR-DRE-3 (M):** Drill‑down: clicking any line shows underlying transactions with filters (date, category, tag, member, account).  
- **AR-DRE-4 (S):** Export PDF/CSV/XLSX with localized labels (`pt-BR`/`en-US`), home currency consolidation.
- **AR-DRE-5 (S):** Conversational query support (e.g., _“Show my DRE for last quarter”_).

### 3.2 Cash Flow Statement (Direct Method)

- **AR-CF-1 (M):** Generate **direct-method** Cash Flow for a selectable period with sections:  
  - **Operating:** Salary, benefits, day‑to‑day expenses (groceries, utilities, transport).  
  - **Investing:** **Investment contributions** (cash outflows), asset purchases/sales (property, vehicles, securities).  
  - **Financing:** Loan proceeds (infl inflow), loan principal repayments (outflow), credit card **statement settlements** (outflow).  
- **AR-CF-2 (M):** **Reconciliation:**  
  `Opening Cash + Net Cash (Operating + Investing + Financing) = Closing Cash`.  
  - Define **cash accounts** in settings (wallets/bank/credit card cash‑like).  
- **AR-CF-3 (S):** Toggle **planned** to preview upcoming cash gaps/surpluses from future/recurring/installments.  
- **AR-CF-4 (M):** Drill‑down by section to transactions.  
- **AR-CF-5 (S):** Export PDF/CSV/XLSX.

### 3.3 Balance Sheet (Point-in-time Net Worth)

- **AR-BS-1 (M):** Show **Assets**, **Liabilities**, **Net Worth** at a chosen **as‑of** date (default: today).  
  - **Assets:** Cash & equivalents, investment accounts, receivables, property/vehicles, other assets.  
  - **Liabilities:** Credit card statement balance, personal loans, mortgages, other debts.  
  - **Net Worth:** `Total Assets − Total Liabilities`.
- **AR-BS-2 (M):** **Valuation Policies:**  
  - **Cash:** Current account balances.  
  - **Investments:** If no market integration, use **book value** (sum contributions) or **manual valuation**; if integrated, use latest market value (store price timestamp/source).  
  - **Property/Other:** Manual valuations; maintain valuation history.  
  - **FX:** Convert to **home currency** at **closing rate** (store rate & time).  
- **AR-BS-3 (S):** Trend view (sparkline) for Net Worth over time (monthly snapshots).  
- **AR-BS-4 (S):** Export PDF/CSV/XLSX.

### 3.4 Common Capabilities

- **AR-COM-1 (M):** **Category & Tag Mapping UI** to map app categories/tags to report lines (Operating/Investing/Financing; DRE lines).  
- **AR-COM-2 (M):** **Multi-currency:** Store original amounts; reports consolidate to home currency with recorded exchange rates (source & timestamp).  
- **AR-COM-3 (S):** **Snapshots**: Precompute and store report snapshots for performance and auditability.  
- **AR-COM-4 (M):** **i18n:** Fully localized names, labels, and exports for English and Portuguese (Brazil).  
- **AR-COM-5 (M):** **TDD:** Unit tests for classification and arithmetic; integration tests for drill‑downs; export snapshots stable.

---

## 4) Data Model

> Tables below extend the existing schema (Supabase/Postgres). Names are indicative.

### 4.1 Configuration & Mapping

- **`report_settings`**  
  - `household_id (fk)`, `enabled (bool)`, `gate_method (enum: opt_in|edu_unlock)`, `enabled_at (timestamptz)`, `home_currency (text)`  
  - `valuation_policy_jsonb` (e.g., investments: book|market|manual)  
  - `cash_accounts[] (uuid)` (list of account ids considered “cash & equivalents”)  

- **`category_mapping`** (user-defined mapping to report lines)  
  - `household_id (fk)`, `category_id (fk)`, `report_type (enum: dre|cash_flow)`,  
  - `dre_line (enum: revenue|operating_expense|other_income|other_expense|null)`,  
  - `cash_flow_section (enum: operating|investing|financing|null)`,  
  - `tags_include[] (text)`, `tags_exclude[] (text)`  

### 4.2 Assets, Liabilities & Valuations

- **`balance_item`**  
  - `id`, `household_id`, `type (enum: asset|liability)`, `subtype (enum: cash|investment|property|vehicle|loan|credit_card|other)`,  
  - `name`, `institution (text|null)`, `currency`, `external_ref (text|null)`, `is_cash (bool)`, `created_at`  

- **`balance_valuation`**  
  - `id`, `balance_item_id (fk)`, `as_of (date)`, `value (numeric)`, `currency (text)`,  
  - `valuation_method (enum: book|market|manual)`, `source (text)`, `fx_rate (numeric|null)`, `fx_source (text|null)`, `recorded_at`  

*(For cash accounts, valuations can be auto-derived from ledger balances; for marketable investments, record source & timestamp.)*

### 4.3 Statement Snapshots (Optional but Recommended)

- **`statement_snapshot`**  
  - `id`, `household_id`, `report_type (dre|cash_flow|balance_sheet)`,  
  - `period_start (date|null)`, `period_end (date|null)`, `as_of (date|null)`,  
  - `home_currency (text)`, `parameters_jsonb` (filters, fx policy),  
  - `lines_jsonb` (structured lines & subtotals), `totals_jsonb`,  
  - `generated_at (timestamptz)`, `version (int)`  

**Example `lines_jsonb` for DRE**
```json
{
  "revenues": [{"name":"Salary","amount":12000.00}],
  "operating_expenses": [
    {"name":"Groceries","amount":-1800.00},
    {"name":"Transport","amount":-600.00}
  ],
  "other_income_expenses": [{"name":"Car sale gain","amount":1500.00}],
  "net_result": 10100.00
}
```

---

## 5) Calculation & Classification Rules

- **Planned vs. Realized:**  
  - **Default** reports include **realized** only.  
  - **Planned overlay** (toggle) includes `status=planned` (future, installments, recurring) with visual differentiation.
- **Cash Flow Classification Tips:**  
  - **Operating:** All day‑to‑day incomes/expenses (default for expenses/incomes).  
  - **Investing:** Investment **contributions** (outflows), asset purchases/sales.  
  - **Financing:** Loan disbursements/repayments; **credit card statement payment** classified as Financing outflow (while underlying purchases remain Operating).  
- **Balance Sheet:**  
  - **Assets/Liabilities** computed from latest valuation as of date; if missing, fallback to nearest prior valuation; flag missing values in UI.  
  - **Net Worth** equals sum(assets) − sum(liabilities).  
- **FX:**  
  - Use stored **closing rate** (`fx_rate`) for the as‑of or end‑date. If missing, prompt to fetch/enter rate and flag in report.

---

## 6) Non‑Functional Requirements

- **Performance:**  
  - Generate reports ≤ **2s P95** up to **50k** transactions per household.  
  - Drill‑down queries ≤ **1.5s P95** with indexed filters.
- **Reliability:**  
  - Snapshots reproducible by versioned parameters.  
  - Idempotent snapshot generation keyed by `(household_id, type, period/as_of, version)`.
- **Usability:**  
  - Clear tooltips & **“Explain this”** help cards.  
  - Beginner mode reduces jargon (“Net Savings” alongside “Net Income”).  
- **i18n:**  
  - Localize report names and line items for **en**/**pt‑BR** (e.g., _Receitas, Despesas Operacionais, Resultado Líquido_).
- **Security & Privacy:**  
  - Respect role restrictions; children do not see adult salaries unless explicitly allowed.  
  - Exports watermarked with household name and generation date.

---

## 7) TDD & QA

- **Unit Tests:**  
  - Category mapping → DRE/cash flow lines; FX consolidation; net worth computation; reconciliation identity for cash flow.  
- **Integration Tests:**  
  - Planned overlay; installments; recurring; credit card settlement classification; drill‑down filters.  
- **E2E:**  
  - Unlock via Education completion; opt‑in flow; exports; localization switches.  
- **Golden Files:**  
  - Snapshot JSONs for representative households (EN/PT-BR, multi‑currency, loans, investments).

---

## 8) User Stories & Acceptance Criteria

### Epic: Unlock & Onboarding

1. **Story:** As a beginner, I can **unlock** reports by completing **Budgeting Basics** (DRE/Cash Flow) and **Investing 101** (Balance Sheet), or by **opting in**.  
   **AC:** When track completion is recorded or opt‑in toggled, the corresponding reports become visible; a one‑time intro is shown.

2. **Story:** As a guardian, I can restrict **children** from viewing income details.  
   **AC:** Child role sees only allowed sections/aggregates; income lines are hidden unless enabled.

### Epic: DRE / Income Statement

1. **Story:** As a user, I can view **DRE** for last month with net result.  
   **AC:** Revenues and expenses reflect realized transactions; **Net Result** equals `Revenues − Expenses`; drill‑down reveals the exact transactions.

2. **Story:** As a user, I can **overlay planned** incomes/expenses.  
   **AC:** Toggle shows planned contributions/installments in lighter style; totals indicate planned separately.

3. **Story:** As a user, I can **export** the DRE in my language and home currency.  
   **AC:** Export renders localized headings and formatted currency; generation ≤ 2s.

### Epic: Cash Flow Statement

1. **Story:** As a user, I can see **Operating, Investing, Financing** cash flows for the quarter and a **reconciliation** to closing cash.  
   **AC:** `Opening + Net(Ops+Inv+Fin) = Closing` holds; cash accounts list is used; drill‑down works.

2. **Story:** As a user, I can preview the **next 90 days** planned cash flow.  
   **AC:** Planned transactions populate appropriate sections; a warning banner indicates forecast mode.

3. **Story:** As a user, when I pay my **credit card bill**, it appears in **Financing** while day‑to‑day purchases remain **Operating**.  
   **AC:** Statement payment is a Financing outflow; double‑counting is prevented.

### Epic: Balance Sheet

1. **Story:** As a user, I can view my **Net Worth today**, with assets and liabilities groups.  
   **AC:** Assets and Liabilities reflect latest valuations; Net Worth = Assets − Liabilities.

2. **Story:** As a user, I can manage **valuations** (manual, book, market) and see a **trend** over time.  
   **AC:** Changing valuation method updates the as‑of report; monthly snapshots produce a net worth sparkline.

3. **Story:** As a multi‑currency user, I can see my balance sheet in my **home currency**.  
   **AC:** FX closing rates are applied and disclosed (source and timestamp).

---

## 9) UI & UX Notes

- **Beginner Mode:**  
  - Dual labels (e.g., “**Net Savings (Net Income)**”).  
  - Inline “Learn more” linking to **Educational Module** lessons for each section.  
- **Advanced Mode:**  
  - Show classification chips (Operating/Investing/Financing) on transactions; quick edit mapping.  
- **Visuals:**  
  - DRE: stacked bars by category; Cash Flow: waterfall per period; Balance Sheet: stacked assets vs liabilities with net worth line.

---

## 10) Implementation Notes

- **Pipelines:**  
  - **Online compute** for quick views; **snapshot jobs** for heavy ranges.  
- **Classification:**  
  - Start with **rule‑based** mapping (category → section/line), then **agent suggestions** (optional) with human review.  
- **Performance:**  
  - Materialized views or cached aggregates for large households.  
- **Auditability:**  
  - Store snapshot parameters and sources (valuation method, FX) for reproducibility.

---

## 11) Example Mapping Defaults (Can be Edited)

- **DRE:**  
  - Income categories → **Revenues**.  
  - Everyday expense categories → **Operating Expenses**.  
  - Asset sale gains/losses (tag: `asset_sale`) → **Other**.
- **Cash Flow:**  
  - Expenses/Incomes → **Operating**.  
  - Investment contributions (category: `investments`) & asset purchases/sales → **Investing**.  
  - Loan events & credit card **bill payment** → **Financing**.

---

# Invitation & Referral Mechanism (Optional & Progressive)

## 1) Objective & Scope
Provide a secure, localized, and frictionless invitation system that enables:
- **Household invitations** (invite people to join a family/shared account with a specific role and permissions).
- **Referrals** (invite new users to try the app; optionally reward both sides).

The system must:
- Work via **email, SMS, shareable link, and QR code**.
- Support **universal links / app links** for seamless mobile onboarding.
- Enforce **role‑based access** and **guardian consent for children**.
- Be **optional** (off by default for organizations that don’t need it) and **progressive** (appears after users finish an educational intro, or when they first create a household).

> **Note:** Children’s invitations require guardian/owner approval and age confirmation; see privacy/compliance below.

---

## 2) User Types & Roles
- **Inviter:** Any **Owner/Adult** member of a household (Viewer cannot invite).  
- **Invitee:** Prospective user (Adult/Child/Viewer) receiving an invitation.  
- **Referrer:** Any existing user generating a **referral** invite (optional feature).  
- **Admin (internal):** Can revoke invites and view abuse metrics.

---

## 3) Access & Gating
- **INV-GATE-1 (M):** Invitation UI is **hidden** until the user creates a household or selects “Invite family”.  
- **INV-GATE-2 (S):** “Quick Start” prompt surfaces invites **after** the user completes the **Educational Module Basics** track (optional progressive reveal).  
- **INV-GATE-3 (M):** Referral invites (growth) are **opt‑in** at Settings → Sharing & Referrals.

---

## 4) Functional Requirements

### 4.1 Create Invitation (Household)
- **INV-H-1 (M):** Owner/Adult can invite by **email** and/or **phone** to a specific household role (`adult|child|viewer`).  
- **INV-H-2 (M):** System generates a **single‑use, short‑lived** tokenized link (`https://app.example.com/invite/<token>`), with:
  - `expires_at` default 7 days (configurable 1–30 days)
  - `max_uses = 1` (single‑use)
  - **Token stored as a server‑side hash** (not plaintext).
- **INV-H-3 (M):** Channels: email with localized template, SMS (where supported), **copy link**, and **QR code** for in‑person sharing.  
- **INV-H-4 (S):** Custom message + locale selection (English/Portuguese—Brazil).  
- **INV-H-5 (M):** Rate limits to prevent spam (e.g., 10 invites/day/household; configurable).  
- **INV-H-6 (S):** Resend invite (rotates token, invalidates old link), revoke invite, and view status (pending/accepted/expired/revoked).

### 4.2 Accept Invitation (Household)
- **INV-H-7 (M):** When an invitee opens the link:
  - If **app installed** → open via **universal link/app link**, else → **web onboarding**.
  - Flow: verify token → sign up/sign in → consent & policy → **join household** with the **assigned role**.
- **INV-H-8 (M):** If invitee already has an account:
  - Token binds to existing account after login and adds them to the household (idempotent).
- **INV-H-9 (M):** If the role is **child**:
  - Require **guardian confirmation** by an Owner/Adult (in‑app approve screen).
  - Collect **minimal PII**; hide sensitive household data by default.
- **INV-H-10 (S):** Error screens:
  - **Expired/Revoked**: show friendly message; allow request‑new‑invite.
  - **Already used**: offer to contact the inviter or open household if already a member.
- **INV-H-11 (S):** After accept, show a short onboarding tour and suggest language preferences.

### 4.3 Referrals (Growth, Optional)
- **INV-R-1 (S):** Any user can generate a **referral link** (`https://app.example.com/r/<code>`) with:
  - **Campaign attribution** (UTM params), locale, and **reward policy** (feature‑flagged).
- **INV-R-2 (S):** **Reward Policies** (points, themes, or limited perks) are configurable and versioned; redemption occurs when the new user finishes onboarding (e.g., creates first transaction or completes 3 lessons).  
- **INV-R-3 (S):** Anti‑abuse checks: unique device/user per redemption; geo/velocity rules; optional CAPTCHA.

### 4.4 Messaging & Localization
- **INV-M-1 (M):** Email/SMS templates for **EN** and **pt‑BR**, with placeholders:
  - `{inviter_name}`, `{household_name}`, `{invitee_role}`, `{deep_link}`, `{expires_at}`, `{privacy_link}`
- **INV-M-2 (S):** Branded invite cards for **social/WhatsApp** sharing (image with QR + short copy).  
- **INV-M-3 (M):** Respect **user locale** for all copy and date/currency formatting.

### 4.5 Observability & Admin
- **INV-A-1 (M):** Track statuses (sent/delivered/opened/accepted/expired/revoked) when supported by channel.  
- **INV-A-2 (S):** Admin dashboard: invite volume/time, acceptance rate, abuse flags, top campaigns (for referrals).  
- **INV-A-3 (M):** Audit log: who invited whom, when, role requested, acceptance, revocations.

---

## 5) Security, Privacy & Compliance

- **Token Security:**  
  - **128‑bit+ random token**; store **hash** only; **single‑use**, **short‑lived**; tie token to **household_id** and **intended role**.  
  - On acceptance, **rotate session**, **invalidate token**, and **log** event.
- **Deep Links:**  
  - Use **Universal Links (iOS)** and **Android App Links**; include **state** and **nonce** to prevent CSRF/replay.  
  - **PKCE** if using OAuth; always finish on server to avoid key leakage.
- **Rate Limiting & Abuse:**  
  - Per‑user/household invite **quotas**; velocity checks; optional **CAPTCHA** for public referral pages.  
  - Blocklist/allowlist domains (configurable).  
- **Privacy & Children:**  
  - Enforce **guardian consent** for child accounts; store consent timestamp and actor.  
  - **Data minimization** for child profiles; restrict visibility of adult incomes by default.  
- **Compliance:**  
  - Provide **clear consent** and **terms** on first accept screen; **LGPD/GDPR** alignment (purpose, revocation, data rights).  
  - Email/SMS **unsubscribe**/opt‑out for non‑transactional outreach.

---

## 6) Data Model

> Table/column names are indicative; adapt to your Supabase schema.

### 6.1 Invitations (Household)
**`invitation`**
- `id (uuid, pk)`
- `household_id (uuid, fk)`
- `inviter_user_id (uuid, fk)`
- `invitee_email (text, nullable)`
- `invitee_phone (text, nullable)`
- `intended_role (enum: owner|adult|child|viewer)` — (*owner invites optional, usually first user*)
- `channel (enum: email|sms|link|qr|share)`
- `token_hash (text)` — hashed token
- `expires_at (timestamptz)`
- `max_uses (int, default 1)`
- `remaining_uses (int)`
- `status (enum: pending|accepted|expired|revoked)`
- `locale (text, default ‘auto’)`
- `deep_link_url (text)` — generated
- `metadata_jsonb` — (campaign, notes)
- `created_at`, `accepted_at (nullable)`, `accepted_user_id (uuid, nullable)`
- `revoked_by (uuid, nullable)`, `revoked_at (timestamptz, nullable)`, `revoke_reason (text, nullable)`

### 6.2 Referrals (Optional)
**`referral_code`**
- `id (uuid, pk)`
- `code (text, unique, short)` — e.g., 8–10 chars
- `referrer_user_id (uuid, fk)`
- `campaign_id (uuid, nullable)`
- `reward_policy_id (uuid, nullable)`
- `max_redemptions (int, default 50)`
- `redemptions (int, default 0)`
- `status (enum: active|paused|expired)`
- `created_at`, `expires_at (nullable)`

**`referral_redemption`**
- `id (uuid, pk)`
- `referral_code_id (fk)`
- `new_user_id (uuid, fk)`
- `device_fingerprint (text, nullable)`
- `redeemed_at (timestamptz)`
- `reward_state (enum: pending|granted|reversed)`
- `metadata_jsonb` — attribution/UTM, locale

### 6.3 Consent & Audit
**`guardian_consent`**
- `id (uuid, pk)`
- `household_id (fk)`
- `child_user_id (fk)`
- `consenting_user_id (fk)` — owner/adult
- `consent_type (enum: invite|data_access)`
- `consented_at (timestamptz)`
- `notes (text)`

**`audit_log`**
- (reuse existing) record **invite_created**, **invite_accepted**, **invite_revoked**, **referral_redeemed** events.

---

## 7) API/Edge Functions (Server-Side)

- `POST /invites` → create invitation (validates role, rate limits, creates token, sends message).  
- `POST /invites/:id/resend` → rotates token, resends.  
- `POST /invites/:id/revoke` → revoke; invalidate token.  
- `GET /invites/:token` → validate token (no PII leak), return minimal info (household name, role, locale).  
- `POST /invites/:token/accept` → after auth, join household (RLS‑checked), mark accepted.  
- `POST /referrals` → create/refetch referral code.  
- `POST /referrals/:code/redeem` → attribute signup and trigger reward logic (idempotent).  

> **Security:** All write operations authenticated; public token validation returns **generic** messages to avoid account enumeration.

---

## 8) UX Flows (High-Level)

**Create Invite (Owner/Adult)**
1. Open Household → Members → “Invite”.  
2. Choose Role (Adult/Child/Viewer), enter email/phone, optional note, select channel.  
3. Send → success toast + status shows **Pending**.

**Accept Invite (Invitee)**
1. Tap link/QR → app/web opens **Invite Preview** (household name, role, inviter).  
2. Sign up / Sign in → consent screen (terms/privacy, locale).  
3. If **Child** → route to **Guardian approval** (notifies household).  
4. Success → “Welcome to *Household*” and quick tour.

**Referral**
1. User copies referral link from Settings → Sharing.  
2. Recipient signs up via referral → upon activation event (e.g., first 3 lessons), **grant reward**.

---

## 9) Non‑Functional Requirements

- **Performance:**  
  - Invite creation **< 300 ms** (server), acceptance **< 500 ms** excluding user auth.  
- **Availability:**  
  - Graceful degradation: if email delivery fails, still provide copyable link/QR.  
- **Localization:**  
  - All templates and screens in **EN** and **pt‑BR**; dates/currency per locale.  
- **Observability:**  
  - Metrics: invite send rate, open/accept rate, token errors, abuse rejections.  
  - Alerts on bounce spikes or abuse triggers.

---

## 10) TDD & QA

- **Unit Tests:**  
  - Token generation (entropy, length), hashing/verification, expiry, single‑use, revocation.  
  - Role enforcement (Owner/Adult only; Child restricted).  
  - Rate limit logic and error messages (localized).
- **Integration Tests:**  
  - Email/SMS template rendering (EN/pt‑BR); deep link round‑trip mobile/web; QR decoding.  
  - Accept flow: existing user, new user, expired/revoked token, resend path.  
  - Child invite: guardian approval + RLS visibility checks.
- **E2E (Web + Mobile):**  
  - Household invite end‑to‑end; referral signup and reward granting; analytics attribution.  
- **Security Tests:**  
  - Replay attempt with used token; CSRF/state mismatch; enumeration resistance.

---

## 11) Acceptance Criteria (Samples)

- **AC‑INV‑1:** Creating an invite generates a **single‑use** link that **expires** at configured time; opening after expiry shows a **friendly error** with “Request new invite”.  
- **AC‑INV‑2:** When an invite is **accepted**, the invitee appears in the household with the **intended role** and the token becomes **invalid**.  
- **AC‑INV‑3:** **Child** invitations require **guardian approval** before the child can view household data; child sees restricted UI.  
- **AC‑INV‑4:** Email and SMS invites render in the **invitee’s locale** (or inviter’s chosen locale) and include **household name** and **expiration**.  
- **AC‑INV‑5:** Referral redemptions are **idempotent**, reward only once per new user/device, and log attribution.  
- **AC‑INV‑6:** Rate limiting prevents more than **N** invites/day/household; UI surfaces an informative, localized message.

---

## 12) Message Templates (Placeholders)

**Subject (EN):** “{inviter_name} invited you to join {household_name}”  
**Body (EN):**  
“Hi! {inviter_name} invited you to join **{household_name}** as **{invitee_role}**.  
Tap to accept: {deep_link}  
This link expires on {expires_at}. By continuing, you agree to our Terms and Privacy Policy.”

**Assunto (pt‑BR):** “{inviter_name} convidou você para {household_name}”  
**Corpo (pt‑BR):**  
“Olá! {inviter_name} convidou você para **{household_name}** como **{invitee_role}**.  
Toque para aceitar: {deep_link}  
O link expira em {expires_at}. Ao continuar, você concorda com nossos Termos e Política de Privacidade.”

---

## 13) Configuration & Feature Flags

- `invites.enabled` (default **true**), `referrals.enabled` (default **false**).  
- `invites.expiry_days` (default **7**), `invites.daily_quota` (default **10**).  
- `children.require_guardian_approval` (default **true**).  
- `referrals.reward_policy` (id/version), `referrals.activation_event` (e.g., first transaction, 3 lessons).

---

## 14) Future Enhancements (Optional)

- **Bulk invites** (CSV) for larger groups (with throttling).  
- **Domain‑based auto‑join** (e.g., `@familyname.com`) for private communities.  
- **In‑app contact picker** (with explicit permission and privacy guardrails).  
- **Agentic assist:** Suggest invitees based on repeated shared expenses or frequent payees (opt‑in, privacy‑aware).

---

# **Payments & Subscriptions — Stripe Integration**

## 1) Objective & Scope
Enable the app to **monetize** via:
- **Subscriptions** (e.g., Free, Pro, Family/Household, Add‑ons).
- **One‑time purchases** (optional; e.g., extra storage, course packs).
- **Trials, coupons, promotions**, and **dunning** (retry on failed payments).
- **Self‑service billing portal** for payment method updates, invoices, cancellations.
- **Localization** and **payment methods** suitable for Brazil and global users.

> **Platform policy note:** On **mobile** (iOS/Android), selling **purely digital content/features consumed in the app** may require Apple/Google **in‑app purchase** rails. Use **Stripe** for **web** checkout and for **permitted** cases on mobile (e.g., B2B, physical services, or if purchase completes outside the app’s purchase UI). Provide an **alternative web flow** to remain compliant.

---

## 2) Supported Payment Flows

- **Checkout & Billing**
  - **Stripe Billing** for subscriptions (monthly/yearly), trials, proration.
  - **Stripe Checkout** (hosted) for minimal PCI scope.
  - **Stripe Customer Portal** for self‑service management.
  - **Stripe Payment Element / PaymentSheet** (optional advanced, web/mobile).
- **Payment Methods (region‑aware)**
  - **Cards** (Visa/Mastercard/Amex, etc.), **Apple Pay / Google Pay**.
  - **Local methods** enabled by Stripe in the account’s region (e.g., **bank transfers, instant pay methods like PIX in Brazil**, and others when available). Availability depends on your Stripe account configuration and compliance.
- **Taxes & Invoices**
  - **Stripe Tax** (optional) for automatic tax calculation.
  - Receipts/invoices via Stripe; surface downloadable invoices in‑app.

---

## 3) Access, Roles & Gating

- **PAY-GATE-1 (M):** Billing UI appears only when **monetization is enabled** (feature flag).
- **PAY-GATE-2 (M):** Subscriptions are **per household** (default) or **per user** (configurable), respecting RLS.
- **PAY-ROLE-1 (M):** Only **Owner/Adult** can purchase/manage a household plan; **Child/Viewer** cannot modify billing.
- **PAY-POL-1 (M):** On mobile, if in‑app purchase policies apply, the UI must:
  - Hide Stripe checkout button and show **StoreKit/Play Billing** path, **or**
  - Deep‑link to **web checkout** (outside the app’s purchase UI), with clear messaging.

---

## 4) Functional Requirements

### 4.1 Products, Prices & Plans
- **PAY-PL-1 (M):** Support **Free**, **Pro (Monthly/Yearly)**, **Family/Household** (X seats), and **Add‑ons** (e.g., extra storage, additional OCR minutes).
- **PAY-PL-2 (S):** **Trials** (e.g., 7/14/30 days), require payment method on start (configurable).
- **PAY-PL-3 (S):** **Coupons/Promotions** (percent/amount off; duration once, repeating, forever).
- **PAY-PL-4 (S):** **Metered/usage‑based** add‑ons (e.g., extra AI/vision minutes) reported to Stripe Billing usage records.

### 4.2 Checkout
- **PAY-CO-1 (M):** Create a **Stripe Checkout Session** for web purchases:
  - Input: `household_id`, `user_id`, `price_id`, `mode (subscription|payment)`, `success_url`, `cancel_url`, `locale`.
  - Output: URL to redirect; session is **idempotent**.
- **PAY-CO-2 (M):** **Prefill** email, locale (en/pt‑BR), address (for tax), and **tax id** fields (CPF/CNPJ) when available.
- **PAY-CO-3 (S):** **Apple Pay / Google Pay** enablement on supported devices.
- **PAY-CO-4 (S):** **Payment method options** are region‑aware; include local options (e.g., PIX) if enabled on the Stripe account.

### 4.3 Customer Portal
- **PAY-CP-1 (M):** Provide a **self‑service Customer Portal**:
  - Update payment methods, view invoices, download receipts, cancel or change plan, update billing details (including tax IDs).
- **PAY-CP-2 (S):** Localize to **en** and **pt‑BR**; reflect pricing in **BRL** or chosen currency.

### 4.4 Subscriptions Lifecycle
- **PAY-SUB-1 (M):** On **checkout.session.completed** / **invoice.paid**:
  - Grant **entitlements** (plan, seats, add‑ons), set `current_period_end`, `status=active`.
- **PAY-SUB-2 (M):** On **invoice.payment_failed**:
  - Trigger **dunning**: retries per Stripe Billing rules; send localized email and in‑app notifications.
- **PAY-SUB-3 (M):** On **customer.subscription.updated/deleted**:
  - Update entitlements; handle **proration** on upgrades/downgrades; **grace period** on cancel‑at‑period‑end.
- **PAY-SUB-4 (S):** **Seat management** for Family plans: Owner assigns seats to members; handle seat overage prompts.

### 4.5 Refunds, Cancellations & Adjustments
- **PAY-RC-1 (M):** Owner can **cancel** at period end via Customer Portal; reflect immediately in entitlements (`cancel_at_period_end=true`).
- **PAY-RC-2 (S):** Admin‑initiated **refunds/credits** via Stripe Dashboard propagate to app state via webhook (**charge.refunded**, **credit_note.created**).
- **PAY-RC-3 (S):** **Proration** for mid‑cycle plan changes per Stripe settings.

### 4.6 Taxes, Invoices & Compliance
- **PAY-TAX-1 (S):** Use **Stripe Tax** when enabled; otherwise collect **billing address + tax ID** (CPF/CNPJ) and calculate tax offline or set price tax‑inclusive.
- **PAY-TAX-2 (S):** Store **tax identifiers** and show on invoices; users can download invoices from portal or in‑app.
- **PAY-TAX-3 (M):** Ensure **PCI scope minimization**: do **not** store raw card data—only Stripe IDs and last4/brand.

### 4.7 Fraud & Risk
- **PAY-FRD-1 (M):** Enable **3DS/SCA** where required (EU/UK); let Stripe handle step‑up authentication.
- **PAY-FRD-2 (S):** Use **Stripe Radar** default rules; monitor disputes via **dispute.* webhooks**.

### 4.8 Localization & Currency
- **PAY-L10N-1 (M):** Display prices in **home currency** where feasible (**BRL** default for Brazil); show localized decimals and date formats.
- **PAY-L10N-2 (M):** All UI and emails localized to **English** and **Portuguese (Brazil)**.

---

## 5) Data Model (Supabase/Postgres)

> Minimal, normalized tables linking users/households to Stripe objects. Extend if you add marketplaces later.

**`billing_customer`**  
- `id (uuid, pk)`  
- `user_id (uuid, fk)` (or `household_id` if billing is per household)  
- `stripe_customer_id (text, unique)`  
- `email (text)`, `locale (text)`  
- `tax_id (text, nullable)`, `tax_id_type (enum: cpf|cnpj|vat|other|null)`  
- `created_at`, `updated_at`

**`billing_subscription`**  
- `id (uuid, pk)`  
- `household_id (uuid, fk)`  
- `stripe_subscription_id (text, unique)`  
- `plan_key (text)`  // e.g., `pro_monthly`, `family_yearly`  
- `status (enum: trialing|active|past_due|canceled|incomplete|incomplete_expired|unpaid)`  
- `current_period_start (timestamptz)`, `current_period_end (timestamptz)`  
- `cancel_at (timestamptz, nullable)`, `cancel_at_period_end (bool)`  
- `seat_limit (int, nullable)`  
- `metadata_jsonb`  // add‑ons, coupon, campaign  
- `created_at`, `updated_at`

**`billing_price_catalog`** (sync of Stripe Products/Prices for UI)  
- `stripe_price_id (text, pk)`  
- `product_key (text)`, `price_nickname (text)`  
- `currency (text)`, `unit_amount (bigint)`  // minor units  
- `recurring_interval (enum: month|year|null)`  
- `is_metered (bool)`  
- `active (bool)`  
- `features_jsonb`  // entitlements

**`billing_event_log`**  
- `id (uuid, pk)`  
- `stripe_event_id (text, unique)`  
- `type (text)`  
- `payload_jsonb`  
- `processed_at (timestamptz)`  
- `status (enum: processed|skipped|error)`  
- `error_message (text, nullable)`  
- `created_at`

**`billing_entitlement`** (effective feature switches)  
- `id (uuid, pk)`  
- `household_id (uuid, fk)`  
- `feature_key (text)`  // e.g., ocr_minutes, seats, advanced_reports  
- `value_num (numeric)` or `value_jsonb`  
- `valid_until (timestamptz, nullable)`  
- `source (enum: subscription|trial|promo|admin)`  
- `updated_at`

> RLS ensures only members of the household can read their billing data; only Owner/Adult can write.

---

## 6) Server APIs / Edge Functions

- **POST `/api/billing/create-checkout-session`**  
  **Auth:** Owner/Adult.  
  **Body:** `{ household_id, price_id, mode, locale }`  
  **Behavior:** Validates ownership, creates Checkout Session (idempotency key = `household_id:price_id:ts`), returns `url`.

- **POST `/api/billing/create-portal-session`**  
  **Auth:** Owner/Adult.  
  **Body:** `{ household_id, return_url, locale }`  
  **Behavior:** Creates **Customer Portal** session and returns `url`.

- **POST `/api/billing/usage-report`** (optional for metered)  
  **Auth:** Server/Job.  
  **Body:** `{ subscription_item_id, quantity, timestamp }`

- **POST `/api/stripe/webhook`**  
  **Auth:** Public endpoint with **Stripe signature verification**; processes events:
  - `checkout.session.completed`, `payment_intent.succeeded`,  
  - `invoice.paid`, `invoice.payment_failed`,  
  - `customer.subscription.created|updated|deleted`,  
  - `charge.refunded`, `credit_note.created`, `dispute.*`
  
  **Behavior:** Upsert `billing_customer`, `billing_subscription`, update `billing_entitlement`, append `billing_event_log`. Must be **idempotent**.

---

## 7) Entitlements & Feature Flags

- **EVAL-ENT-1 (M):** Centralize entitlement evaluation (server): input `household_id` → output features and limits.  
- **EVAL-ENT-2 (M):** On webhook updates, recompute and cache entitlements.  
- **EVAL-ENT-3 (S):** Grace period behavior (e.g., 3 days on past_due); read from config.

---

## 8) UX & Localization

- **Pricing Page:** Show plans with localized copy (EN/pt‑BR), currency (BRL), taxes notice, and terms.  
- **Checkout Button:** On **web**, open Stripe Checkout; on **mobile**, handle store policy (see **PAY-POL-1**).  
- **Billing Settings:** Show status (Active/Trialing/Past Due), next charge date, manage button (Customer Portal).  
- **Receipts & Invoices:** Link to Stripe‑hosted invoice, plus in‑app receipts with localized amounts and tax IDs.  
- **Errors:** Friendly, localized messages for declined cards, 3DS required, expired sessions; retry CTA.

---

## 9) Non‑Functional Requirements

- **Security**
  - Verify **Stripe webhook signatures**; reject failing events; log audit entries.  
  - Use **idempotency keys** for create/update API calls.  
  - Never store PAN/CVV; only store Stripe IDs, last4, brand, exp month/year.
- **PCI Scope**
  - Prefer **Stripe Checkout** and **Customer Portal** to keep PCI at **SAQ‑A**.  
- **Performance**
  - Checkout/Portal session creation **< 300 ms** server‑side.  
  - Webhook processing **< 500 ms** P95; queue heavy work if needed.  
- **Availability**
  - If webhooks are down, **retry queue** ensures eventual consistency.  
- **Observability**
  - Metrics: conversions, failures by payment method, dunning success, refunds, disputes.  
  - Alerts: webhook verification failures, spike in `payment_failed`.

---

## 10) TDD & QA

- **Unit Tests**
  - Price catalog sync mapping to entitlements.  
  - Entitlement evaluation (plan → features) including seat counting and metered add‑ons.  
  - Webhook signature verification and idempotency handling.
- **Integration Tests**
  - Happy‑path: checkout → `session.completed` → `invoice.paid` → entitlements active.  
  - Dunning: `invoice.payment_failed` → retry schedule → success/failure branches.  
  - Cancellations and proration on upgrades/downgrades.  
  - Tax ID capture flow and invoice rendering link.
- **E2E (Web + Mobile)**
  - Web: Pricing → Checkout → Return → Features unlocked.  
  - Mobile: Web flow deep‑link return; store policy variant (IAP vs external web).  
  - Localization: EN/pt‑BR prices and copy.
- **Security Tests**
  - Webhook replay attempts; invalid signature; malformed payload; rate limiting.

---

## 11) User Stories & Acceptance Criteria

### Epic: Purchase & Manage Subscription
1. **Story:** As a household Owner, I can buy **Pro Monthly** and instantly unlock premium features.  
   **AC:** After successful checkout, `billing_subscription.status=active` and entitlements updated within **≤ 5s**.

2. **Story:** As a user, I can switch from **Monthly → Yearly** with proration handled automatically.  
   **AC:** Subscription updates via portal; next invoice reflects proration; entitlements remain active.

3. **Story:** As an Owner, I can **cancel** at period end and keep access until the end date.  
   **AC:** `cancel_at_period_end=true` set; app shows end date; features remain until `current_period_end`.

4. **Story:** As a user in Brazil, I can pay with **local methods** (if enabled in Stripe).  
   **AC:** Checkout shows region‑appropriate methods (cards, wallets, and local methods enabled on account); payment succeeds and events are processed.

### Epic: Dunning & Recovery
5. **Story:** If my payment fails, I receive a **localized email** and an in‑app banner to update my card.  
   **AC:** On `invoice.payment_failed`, banner appears; portal link available; upon success (`invoice.paid`), banner disappears.

### Epic: Invoices & Tax
6. **Story:** I can add my **CPF/CNPJ** to appear on the invoice.  
   **AC:** Billing details stored; invoices show tax ID; downloadable from portal and app.

### Epic: Mobile Policy Compliance
7. **Story:** On iOS, if digital purchase policies apply, I’m guided to the **compliant** purchase path.  
   **AC:** App hides Stripe purchase UI in‑app and offers platform‑compliant or web path with clear messaging.

---

## 12) Configuration & Feature Flags

- `billing.enabled` (default **true**)  
- `billing.mode` (`per_household` | `per_user`, default **per_household**)  
- `billing.currency_default` (e.g., **BRL**)  
- `billing.tax.enabled` (default **false**)  
- `billing.dunning.grace_days` (e.g., **3**)  
- `billing.mobile.policy_mode` (`iap_required` | `web_only` | `mixed`)  
- `billing.portal.allowed_actions` (upgrade, downgrade, cancel, payment_method_update)

---

## 13) Operational Playbooks

- **Price changes:** Update Stripe Products/Prices → run **catalog sync job** → update feature gates → regression test entitlements.  
- **Outage (webhooks):** Switch to **polling fallback** for critical subscriptions; reprocess failed events; monitor backlog.  
- **Refunds/disputes:** Process in Stripe; app updates from webhook; notify user and adjust entitlements if needed.

---

## 14) Future Enhancements (Optional)

- **Stripe Payment Links** for quick promotions.  
- **Stripe Invoicing** for B2B annual contracts with purchase orders.  
- **Family seat add‑ons** auto‑scale by member count.  
- **Marketplace expansion** (Stripe Connect) if you later enable P2P or third‑party sellers.

---
