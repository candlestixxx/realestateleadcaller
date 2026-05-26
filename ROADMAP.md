# ROADMAP: Long-Term Structural Milestones

## Phase 1: Real-World Integrations
- [x] Connect Twilio for real outbound/inbound SMS functionality.
- [x] Connect Vapi or Retell AI for live Voice calling and warm bridging.
- [x] Integrate SendGrid for email dispatch and tracking (opens, clicks).

## Phase 2: Security & Authentication
- [x] Implement NextAuth for agent login.
- [x] Implement Row-Level Security / Multi-tenancy so multiple agents can use the platform without seeing each other's leads.

## Phase 3: Advanced Automation & MCP
- [ ] Move the Workflow Engine to a dedicated task queue (e.g., BullMQ, Inngest) instead of a simple tick endpoint.
- [ ] Expose an MCP Server so the AI caller can dynamically query live MLS inventory during a call.
- [ ] Build a visual drag-and-drop workflow builder on the frontend to replace hardcoded state machine logic.
