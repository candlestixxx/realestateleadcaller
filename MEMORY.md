# System MEMORY & Architecture

## Current State (MVP v0.1.0)
*   **Framework:** Next.js (App Router), React, Tailwind CSS.
*   **Database:** Prisma ORM connected to local SQLite (`dev.db`).
*   **Automation:** Relies on manual triggering of `/api/engine/tick` to simulate a background cron job for processing the state machine.
*   **Integrations:** Uses a Mock Adapter pattern (`src/lib/adapters/index.ts`). No real external APIs (Twilio, Vapi, SendGrid) are currently hooked up.

## Design Preferences
*   **Continuous Autonomous Execution:** The system prefers sequential, autonomous completion of features with strict git versioning and changelog tracking.
*   **Strict Typing:** TypeScript is enforced across API routes and Prisma schemas. Next.js 15+ async `params` patterns are adhered to for dynamic routing.
*   **Clean UI:** Tailwind CSS is used strictly. Components should remain stateless where possible, deferring logic to API hooks.

## Known Limitations
*   The Workflow Engine requires external cron scheduling to operate autonomously in production.
*   The "Warm Transfer" flow is currently mocked; bridging a live SIP call via Vapi/Twilio will require a significant refactor of the webhook infrastructure to handle asynchronous call state events.
