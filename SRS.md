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
