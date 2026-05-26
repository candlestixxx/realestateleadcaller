# TODO: Immediate Short-Term Tasks

## Outbound Integrations (Phase 5 Prep)
- [x] Implement outbound webhooks module to push lead status updates back to upstream CRMs (e.g., Follow Up Boss).
- [x] Create UI on the Lead Profile to trigger a manual "Sync to CRM" push.
- [ ] Add `crm_webhook_url` configuration field to the Settings > Integrations UI page.

## Knowledge Base & MCP Expansion
- [ ] Develop a "Knowledge Base" UI module to upload FAQ snippets.
- [ ] Connect the Knowledge Base to the AI Call prompt generation.
- [ ] Create an Email Reply webhook handler for SendGrid/Mailgun.

## Completed Tasks
- [x] Create `/api/webhooks/twilio` to receive incoming SMS replies.
- [x] Write an LLM adapter (OpenAI mock for now) to perform Sentiment Analysis on the incoming message.
- [x] Automatically update lead status to `Do Not Contact` if the intent is "STOP" or "Unsubscribe".
- [x] Automatically update lead status to `Hot Lead` if the sentiment is highly positive or asks for a showing.
- [x] Auto-pause active workflows for leads that respond to prevent double-messaging.
