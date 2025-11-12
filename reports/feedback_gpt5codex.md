# Web App Review & Improvement Plan
**Reviewer:** Cascade (GPT-5 Codex)

**Date:** 12 Nov 2025

---

## Executive Summary
The Image Generator v2 codebase demonstrates solid foundations (React + Vite, TanStack Query, Supabase) and valuable domain features, yet key risks remain around security, maintainability, performance, and UX. Hard-coded credentials, monolithic page components, inconsistent error handling, and heavy Supabase queries threaten scalability. This document summarizes the current state, highlights critical issues, and outlines a prioritized roadmap to elevate reliability, developer velocity, and user satisfaction.

---

## Highlights
1. **Robust data tooling** – TanStack Query, Supabase integration, and shared filter utilities provide a capable data backbone.@src/App.tsx#1-35 @src/components/filters/FiltersPanel.tsx#66-595
2. **Rich prompt & gallery workflows** – Prompt selection, generation controls, and gallery metrics are feature-rich and aligned to core use cases.@src/pages/Prompts.tsx#78-832 @src/pages/Gallery.tsx#153-767
3. **Comprehensive documentation** – Architecture and technical docs offer helpful onboarding context for contributors.@ARCHITECTURE_AND_GUIDELINES.md#1-256 @DOCUMENTATION.md#1-156

---

## Critical Findings (Immediate Attention Required)
1. **Committed Supabase credentials** – API URL and anon key are hard-coded in source control, posing immediate security exposure.@src/integrations/supabase/client.ts#1-16
2. **Monolithic route components** – `Prompts.tsx` (~900 lines) and `Gallery.tsx` (>1k lines) combine data fetching, state orchestration, and complex UI logic, slowing iteration and increasing defect risk.@src/pages/Prompts.tsx#78-832 @src/pages/Gallery.tsx#153-767
3. **Inconsistent error handling & user feedback** – Critical flows mix toasts, silent failures, and blocking `window.confirm`, lacking global safety nets or structured logging.@src/pages/Prompts.tsx#425-519 @src/services/imageGeneration.ts#141-547
4. **Heavy Supabase queries** – Broad `select` clauses with relational joins fetch far more data than rendered, impacting latency and costs.@src/pages/Prompts.tsx#254-314 @src/pages/Gallery.tsx#359-436

---

## Detailed Review & Recommendations

### 1. Architecture & State Management
- **Observation:** Application shell is lightweight but lacks a global error boundary or centralized logging, so uncaught exceptions surface as blank screens.@src/App.tsx#15-33
- **Observation:** Shared prompt/gallery filters persist via localStorage sync hooks, introducing race conditions and cross-tab churn.@src/hooks/useSharedPromptGalleryState.ts#34-80
- **Recommendation:** Introduce an `ErrorBoundary` wrapper and standardized logger, migrate cross-page UI state to a predictable store (e.g., Zustand slice) while keeping server state in React Query.

### 2. Code Quality & Maintainability
- **Observation:** `Prompts.tsx`, `Gallery.tsx`, and `FiltersPanel.tsx` exceed 500 lines each, interleaving data logic, UI, and side effects.@src/pages/Prompts.tsx#78-832 @src/pages/Gallery.tsx#153-767 @src/components/filters/FiltersPanel.tsx#1-595
- **Observation:** `Tasks.tsx` is marked obsolete yet still routed (`/tasks`), causing dead navigation surface and maintenance overhead.@src/pages/Tasks.tsx#1-112 @src/App.tsx#23-28
- **Recommendation:** Modularize pages into subcomponents/hooks (cards, pagination, bulk actions, dialogs). Remove or revive the Tasks route to avoid ambiguous status. Align README with actual default route (currently Prompts, not REVE).@README.md#1-35

### 3. Data & API Layer
- **Observation:** Prompt/gallery queries select full records, including nested `images` rows, even when only counts or summaries are required.@src/pages/Prompts.tsx#197-313 @src/pages/Gallery.tsx#313-436
- **Observation:** Bulk generating loops run sequentially and lack throttling or cancellation, risking long UI blocks.@src/pages/Prompts.tsx#425-434
- **Recommendation:** Create dedicated Supabase data services with field-level selects, pagination helpers, and request de-duplication. Batch expensive operations and consider worker queues for bulk generations.

### 4. Security & Compliance
- **Observation:** Supabase URL/key exposed in Git history; no guardrails for missing env vars or key rotation.@src/integrations/supabase/client.ts#1-16
- **Observation:** Destructive actions rely solely on `window.confirm`, offering no audit logging or role checks.@src/pages/Prompts.tsx#436-518 @src/pages/Gallery.tsx#549-611
- **Recommendation:** Move credentials to environment variables (`.env.local`, deploy secrets), add runtime validation via `settings.ts`, and audit Supabase RLS policies. Replace confirm dialogs with first-class modals that capture intent and record actions.

### 5. User Experience & Accessibility
- **Observation:** Loading states fall back to spinners/empty screens; no skeletons, lazy loading, or viewport-based rendering.@src/pages/Prompts.tsx#645-806 @src/pages/Gallery.tsx#623-777
- **Observation:** Filters drawer is desktop-oriented; mobile discoverability and keyboard navigation are limited.@src/components/filters/FiltersPanel.tsx#271-589
- **Recommendation:** Add skeleton cards, IntersectionObserver-driven lazy loading, accessible filter toggles, and consistent toasts with actionable messages.

### 6. Performance
- **Observation:** Image generation service performs large synchronous uploads/conversions with extensive logging but no instrumentation, increasing blocking time.@src/services/imageGeneration.ts#141-535
- **Observation:** Gallery view re-sorts results client-side even after ordered fetches, doubling work on each render.@src/pages/Gallery.tsx#115-444
- **Recommendation:** Offload heavy transformations to background workers (Supabase Functions or Cloud Tasks), implement structured metrics, and rely on sorted queries without redundant client sorting where possible.

### 7. Documentation & Developer Experience
- **Observation:** Architecture docs are current, but README still positions REVE generator as the root experience, diverging from actual routing (Prompts dashboard).@README.md#1-35
- **Observation:** No automated testing scaffolding beyond docs, and console logging remains verbose without adjustable levels.@src/services/imageGeneration.ts#141-547 @ARCHITECTURE_AND_GUIDELINES.md#218-244
- **Recommendation:** Update README onboarding, create `.env.example`, scaffold Vitest + Testing Library suites for core flows, and add lint/test commands to CI once secrets are externalized.

---

## Improvement Roadmap

### Immediate (0–2 Weeks)
1. **Secure Secrets:** Remove hard-coded Supabase credentials, add `.env.example`, and validate keys via `settings.ts` on startup.@src/integrations/supabase/client.ts#1-16
2. **Stabilize Error Handling:** Implement global error boundary & logger, replace ad-hoc `console` calls and `window.confirm` with reusable dialog components.@src/pages/Prompts.tsx#436-518 @src/services/imageGeneration.ts#141-547
3. **Clarify Routing & Docs:** Sunset or restore `/tasks`, update README to reflect actual landing experience.@src/pages/Tasks.tsx#1-112 @README.md#1-35

### Near Term (2–6 Weeks)
1. **Modularize Core Pages:** Break Prompts/Gallery into composable components and hooks, extracting data services and shared UI primitives.@src/pages/Prompts.tsx#78-832 @src/pages/Gallery.tsx#153-767
2. **Optimize Data Access:** Create Supabase query helpers with selective columns, typed responses, caching policies, and pagination utilities.@src/pages/Prompts.tsx#197-314 @src/pages/Gallery.tsx#313-436
3. **Enhance UX:** Add skeleton loaders, lazy image loading, and responsive filter panels with keyboard/focus support.@src/pages/Gallery.tsx#623-777 @src/components/filters/FiltersPanel.tsx#271-589
4. **Establish Testing Baseline:** Introduce Vitest + Testing Library for services/components and Playwright smoke tests for prompt-to-gallery flow.@ARCHITECTURE_AND_GUIDELINES.md#218-244

### Long Term (6+ Weeks)
1. **Asynchronous Generation Pipeline:** Move heavy post-processing (variant creation, uploads) into background jobs or Supabase Edge Functions for resilience.@src/services/imageGeneration.ts#321-535
2. **Advanced Observability:** Add metrics (generation time, Supabase latency), structured logs, and alerting for failures.
3. **Feature Enhancements:** Explore saved prompt templates, cost dashboards, and team multi-tenancy aligned with product goals.@src/pages/Gallery.tsx#648-766

---

## Quick Wins
1. Replace `window.confirm` with shared confirmation dialogs for destructive actions.@src/pages/Prompts.tsx#436-518
2. Strip unused routes/dependencies (obsolete Tasks page, backup config files) to reduce mental load.@src/pages/Tasks.tsx#1-112
3. Introduce skeleton cards during prompt/gallery fetch to smooth perceived performance.@src/pages/Prompts.tsx#645-806
4. Add ESLint rule or logger wrapper to curb production `console` noise.@src/services/imageGeneration.ts#141-547
5. Document mobile filter usage and consider a sheet/drawer variant for small screens.@src/components/filters/FiltersPanel.tsx#271-589

---

By addressing security and stability first, then modularizing data-heavy pages and optimizing UX, the team can substantially improve reliability while creating space for future feature development.
