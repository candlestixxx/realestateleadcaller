# ROADMAP: Long-Term Structural Milestones

## Phase 1: Real-World Integrations
- [x] Connect Twilio for real outbound/inbound SMS functionality.
- [x] Connect Vapi or Retell AI for live Voice calling and warm bridging.
- [x] Integrate SendGrid for email dispatch and tracking (opens, clicks).

## Phase 2: Security & Authentication
- [x] Implement NextAuth for agent login.
- [x] Implement Row-Level Security / Multi-tenancy so multiple agents can use the platform without seeing each other's leads.

## Phase 3: Advanced Automation & MCP
- [x] Move the Workflow Engine to a dedicated task queue (e.g., BullMQ, Inngest) instead of a simple tick endpoint.
- [x] Expose an MCP Server so the AI caller can dynamically query live MLS inventory during a call.
- [x] Build a visual drag-and-drop workflow builder on the frontend to replace hardcoded state machine logic.

## Phase 4: Inbound Intelligence & Two-Way Conversations
- [x] Implement Inbound SMS webhook handlers to receive lead replies.
- [x] Build LLM-powered Sentiment & Intent Analysis for inbound messages.
- [x] Auto-pause active follow-up workflows if a user replies.
- [x] Implement Inbound Email webhook handlers to receive lead email replies.
- [x] Develop a Knowledge Base module to allow the AI to answer specific FAQs about the team and listings.

## Phase 5: Outbound Integrations
- [x] Implement outbound webhooks to push lead status updates back to upstream CRMs (Follow Up Boss, KVCore).

## Phase 6: Analytics & Team Metrics
- [x] Add lead conversion metrics and KPI charts to the Dashboard.
- [x] Track AI Call connect rates and warm transfer success rates.
- [x] Implement team leaderboard for appointments set.

## Phase 7: Polish & Tech Debt
- [x] Add explicit Prisma `@relation` fields to `CallLog` and `Appointment` models.
- [x] Review all components for `any` type overrides and ensure strict TypeScript typing.
- [x] Ensure 100% of standard user forms (login, settings, workflow builder) handle loading/error states properly.

## Phase 8: Post-Call Intelligence (Vapi Webhook)
- [x] Implement `/api/webhooks/vapi` to listen for "EndOfCallReport".
- [x] Parse transcript and summary to extract Call Duration, Outcome, and Next Steps.
- [x] Save transcript to the `Conversation` database model.
- [x] Create/Update `CallLog` database model.
- [x] Automatically score the lead based on post-call LLM analysis.

## Phase 9: Workflow Engine Transition
- [x] Replace synchronous `/api/engine/tick` chron job with `inngest` background queue processing.
- [x] Implement retry loops and step-delay mechanics via Inngest steps.

## Phase 10: Model Context Protocol (MCP) Expansion
- [x] Connect the MCP server to live/mock data tables.
- [x] Add calendar availability capabilities to the MCP server.
