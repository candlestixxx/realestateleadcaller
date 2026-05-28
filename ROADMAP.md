# ROADMAP: Long-Term Structural Milestones

## Phase 1-13 Completed
- Core architecture (Twilio, SendGrid, Vapi, Auth, MCP, Inngest, Direct Mail, Analytics, Inbound Intent Parsing, and Calendar API Scheduling) is fully implemented.

## Phase 14: Bi-Directional CRM Synchronization (OAuth & Webhooks)
- [ ] Upgrade the CRM Adapter (`src/lib/adapters/crmOutbound.ts`) from a generic webhook push to a true OAuth connection for a specific platform (e.g., Follow Up Boss).
- [ ] Establish an endpoint that receives updates *from* the CRM (e.g., if an agent manually marks a lead "Closed" in Follow Up Boss, we must immediately halt our Inngest workflows).

## Phase 15: True LLM Sentiment Integration
- [ ] Upgrade `src/lib/adapters/sentiment.ts` from regex/rule-based heuristics to a live OpenAI API call (`gpt-4o-mini`) using Structured Outputs to enforce JSON `{ sentiment, intent }` returns.
