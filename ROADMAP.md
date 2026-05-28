# ROADMAP: Long-Term Structural Milestones

## Phase 1-14 Completed
- Core architecture (Twilio, SendGrid, Vapi, Auth, MCP, Inngest, Direct Mail, Analytics, Calendar API Scheduling, and Bi-Directional CRM Webhooks) is fully implemented.

## Phase 15: True LLM Sentiment Integration
- [ ] Upgrade `src/lib/adapters/sentiment.ts` from regex/rule-based heuristics to a live OpenAI API call (`gpt-4o-mini`) using Structured Outputs to enforce JSON `{ sentiment, intent }` returns.
