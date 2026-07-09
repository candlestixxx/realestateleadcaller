# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Version numbers are tracked globally in `VERSION.md`.

## [0.3.0] - 2026-07-01

### Added
- Phase 23: Notification System Improvements. Added a global `NotificationsBanner` layout component to poll and display unread system events via toast. Updated the `CRM Webhook` and `Vapi Tools Webhook` to dispatch push notifications for new lead ingestion and live AI appointment bookings.

## [0.2.0] - 2026-06-25

### Added
- Phase 21: Geo-Spatial Coordinate Enrichment. Integrated Nominatim API, added `latitude` and `longitude` to Lead model, and updated `/api/leads` and `/leads/import` to geocode addresses automatically on creation.
- Phase 22: Circle Prospecting Map Rendering. Built `/map` dashboard using `react-leaflet` for visual geographic lead representation and generating proximity-based CSV call lists.

## [0.1.0] - 2026-05-25

### Added
- Phase 1 & 2: Initialized Next.js project foundation (App Router, Tailwind CSS, TypeScript).
- Phase 1 & 2: Set up Prisma ORM with SQLite and defined data models (`User`, `Agent`, `Lead`, `FollowUpWorkflow`, etc.).
- Phase 1 & 2: Built MVP UI for Dashboard, Leads list, Lead creation, Lead profile, and Workflow viewer.
- Phase 3: Implemented the Workflow Engine Tick API (`/api/engine/tick`) to simulate background processing of lead follow-ups.
- Phase 3: Automated workflow assignment and scheduling for new leads based on lead type.
- Phase 4: Added `src/lib/scripts.ts` to manage reusable AI scripts (Buyer, Seller, Circle Prospecting, Warm Transfer) with variable replacement.
- Phase 5: Updated Workflow Trigger API to implement detailed Mock Warm Transfer: triggers compiled scripts, mocks agent accept, creates AI Conversation Summaries, and updates lead status.
- Phase 5: Updated Lead Profile UI to dynamically render AI Summaries.
- Phase 6: Added `/api/direct-mail` routes for creating and updating direct mail tasks linked to leads.
- Phase 6: Built `/direct-mail` UI page to list tasks and mark them as sent.
- Phase 7: Added Mock Adapters for `VoiceProvider`, `SmsProvider`, `EmailProvider`, `CrmProvider`, `DirectMailProvider`, `CalendarProvider`, and `SocialMessagingProvider`.
- Phase 8: Overhauled `README.md` and created `.env.example` for documentation polish.
- Created `VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, and `HANDOFF.md` for project governance.
- Short-Term Task: Refactored `/workflows` to dynamically fetch database records instead of rendering mock data.
- Short-Term Task: Set up `.github/workflows/ci.yml` for automated linting and Next.js builds.
- Short-Term Task: Implemented `GET /api/leads` filter and search capabilities via URL query parameters, and enhanced Leads UI list.
- Short-Term Task: Created CRM ingestion webhook (`/api/webhooks/crm`).
- Short-Term Task: Added robust UI error handling and visual workflow step tracking.
- Short-Term Task: Added manual "Send Direct Mail" dispatch trigger to the Lead Profile UI.
- Settings: Built `src/app/settings` UI including Agent Profile, Integrations, and AI Scripts sections.
- Import Leads: Built `src/app/leads/import` utility for bulk CSV lead generation.
- Phase 2 Security: Configured `next-auth` and `bcryptjs` for session management.
- Phase 2 Security: Protected internal API and dashboard routes via Next.js middleware.
- Phase 2 Security: Added credential-based authentication UI (`/login`).
- Phase 1 Integration: Implemented `TwilioSmsProvider` adapter.
- Phase 1 Integration: Implemented `SendGridEmailProvider` adapter.
- Phase 1 Integration: Implemented `VapiVoiceProvider` adapter.
- Phase 2 Security: Implemented Multi-Tenancy database isolation mapping Leads to individual Users.
- Fix: Hoisted ES module imports in `src/lib/adapters/index.ts`.
- Fix: Swapped `replace` for `replaceAll` in AI Script engine to correctly compile multiple instances of the same variable.
- Fix: Inbound CRM Webhooks now assign leads to a default `userId` to prevent them from becoming orphaned in multi-tenant environments.
- Phase 3 Advanced Automation: Scaffolded the Drag-and-Drop Visual Workflow Builder foundation (`src/app/workflows/builder`).
- Phase 3 Advanced Automation: Built `POST` and `PUT` endpoints at `/api/workflows` to support workflow creation and dynamic step re-ordering.
- Phase 3 Advanced Automation: Connected the Visual Workflow Builder UI to the Prisma backend to fetch live workflows and persist drag-and-drop step modifications.
- Phase 3 Advanced Automation: Replaced the synchronous workflow cron tick with `inngest`, moving the state-machine execution logic to a parallelized, auto-retrying background task queue.
